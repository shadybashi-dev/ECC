"""OpenAI provider adapter."""

from __future__ import annotations

import json
import os
from typing import Any

from openai import OpenAI

from llm.core.interface import (
    AuthenticationError,
    ContextLengthError,
    LLMProvider,
    RateLimitError,
)
from llm.core.types import (
    LLMInput,
    LLMOutput,
    ModelInfo,
    ProviderType,
    ToolCall,
)
from llm.providers.constants import EMPTY_FILTERED_RESPONSE_ERROR

GPT_6_ASTRA_MODEL = "gpt-6-astra"


def _parse_tool_arguments(raw_arguments: str | None) -> dict[str, Any]:
    if not raw_arguments:
        return {}

    try:
        arguments = json.loads(raw_arguments)
    except json.JSONDecodeError:
        return {"raw": raw_arguments}

    if isinstance(arguments, dict):
        return arguments
    return {"value": arguments}


class OpenAIProvider(LLMProvider):
    provider_type = ProviderType.OPENAI

    def __init__(self, api_key: str | None = None, base_url: str | None = None) -> None:
        self.client = OpenAI(
            api_key=api_key or os.environ.get("OPENAI_API_KEY"),
            base_url=base_url,
            _enforce_credentials=False,
        )
        self._models = [
            ModelInfo(
                name=GPT_6_ASTRA_MODEL,
                provider=ProviderType.OPENAI,
                supports_tools=True,
                supports_vision=True,
                max_tokens=128000,
                context_window=1050000,
            ),
            ModelInfo(
                name="gpt-4o",
                provider=ProviderType.OPENAI,
                supports_tools=True,
                supports_vision=True,
                max_tokens=4096,
                context_window=128000,
            ),
            ModelInfo(
                name="gpt-4o-mini",
                provider=ProviderType.OPENAI,
                supports_tools=True,
                supports_vision=True,
                max_tokens=4096,
                context_window=128000,
            ),
            ModelInfo(
                name="gpt-4-turbo",
                provider=ProviderType.OPENAI,
                supports_tools=True,
                supports_vision=True,
                max_tokens=4096,
                context_window=128000,
            ),
            ModelInfo(
                name="gpt-3.5-turbo",
                provider=ProviderType.OPENAI,
                supports_tools=True,
                supports_vision=False,
                max_tokens=4096,
                context_window=16385,
            ),
        ]

    def generate(self, input: LLMInput) -> LLMOutput:
        try:
            model = input.model or "gpt-4o-mini"
            if model == GPT_6_ASTRA_MODEL:
                return self._generate_with_responses_api(input)

            params: dict[str, Any] = {
                "model": model,
                "messages": [msg.to_dict() for msg in input.messages],
                "temperature": input.temperature,
            }
            if input.max_tokens:
                params["max_tokens"] = input.max_tokens
            if input.tools:
                params["tools"] = [tool.to_openai_tool() for tool in input.tools]

            response = self.client.chat.completions.create(**params)
            if not response.choices or response.choices[0].message is None:
                raise ValueError(EMPTY_FILTERED_RESPONSE_ERROR)
            choice = response.choices[0]

            tool_calls = None
            if choice.message.tool_calls:
                tool_calls = [
                    ToolCall(
                        id=tc.id or "",
                        name=tc.function.name,
                        arguments=_parse_tool_arguments(tc.function.arguments),
                    )
                    for tc in choice.message.tool_calls
                ]

            usage = None
            if response.usage:
                usage = {
                    "prompt_tokens": response.usage.prompt_tokens,
                    "completion_tokens": response.usage.completion_tokens,
                    "total_tokens": response.usage.total_tokens,
                }

            return LLMOutput(
                content=choice.message.content or "",
                tool_calls=tool_calls,
                model=response.model,
                usage=usage,
                stop_reason=choice.finish_reason,
            )
        except Exception as e:
            msg = str(e)
            if "401" in msg or "authentication" in msg.lower():
                raise AuthenticationError(msg, provider=ProviderType.OPENAI) from e
            if "429" in msg or "rate_limit" in msg.lower():
                raise RateLimitError(msg, provider=ProviderType.OPENAI) from e
            if "context" in msg.lower() and "length" in msg.lower():
                raise ContextLengthError(msg, provider=ProviderType.OPENAI) from e
            raise

    def _generate_with_responses_api(self, input: LLMInput) -> LLMOutput:
        """Generate with Astra's Responses API integration.

        GPT-6 Astra does not accept custom temperature values, and its tool
        calling surface is exposed through the Responses API rather than Chat
        Completions. Keep that compatibility detail local to this model so the
        older OpenAI-compatible models retain their existing request shape.
        """
        responses = getattr(self.client, "responses", None)
        if responses is None:
            raise RuntimeError("The installed OpenAI client does not expose the Responses API")

        params: dict[str, Any] = {
            "model": GPT_6_ASTRA_MODEL,
            "input": [msg.to_dict() for msg in input.messages],
        }
        if input.max_tokens is not None:
            params["max_output_tokens"] = input.max_tokens
        if input.tools:
            params["tools"] = [
                {
                    "type": "function",
                    "name": tool.name,
                    "description": tool.description,
                    "parameters": tool.parameters,
                    "strict": tool.strict,
                }
                for tool in input.tools
            ]

        response = responses.create(**params)
        output_items = getattr(response, "output", None) or []
        tool_calls = [
            ToolCall(
                id=getattr(item, "call_id", "") or getattr(item, "id", ""),
                name=getattr(item, "name", ""),
                arguments=_parse_tool_arguments(getattr(item, "arguments", None)),
            )
            for item in output_items
            if getattr(item, "type", None) == "function_call"
        ]

        usage = None
        response_usage = getattr(response, "usage", None)
        if response_usage:
            usage = {
                "prompt_tokens": getattr(response_usage, "input_tokens", 0),
                "completion_tokens": getattr(response_usage, "output_tokens", 0),
                "total_tokens": getattr(response_usage, "total_tokens", 0),
            }

        content = getattr(response, "output_text", "") or ""
        if not content and not tool_calls:
            raise ValueError(EMPTY_FILTERED_RESPONSE_ERROR)

        return LLMOutput(
            content=content,
            tool_calls=tool_calls or None,
            model=getattr(response, "model", GPT_6_ASTRA_MODEL),
            usage=usage,
            stop_reason=getattr(response, "status", None),
        )

    def list_models(self) -> list[ModelInfo]:
        return self._models.copy()

    def validate_config(self) -> bool:
        return bool(self.client.api_key)

    def get_default_model(self) -> str:
        return "gpt-4o-mini"
