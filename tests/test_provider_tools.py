from types import SimpleNamespace

import pytest

from llm.core.types import LLMInput, Message, ProviderType, Role, ToolDefinition
from llm.providers.claude import ClaudeProvider
from llm.providers.constants import EMPTY_FILTERED_RESPONSE_ERROR
from llm.providers.openai import GPT_6_ASTRA_MODEL, OpenAIProvider


def _tool() -> ToolDefinition:
    return ToolDefinition(
        name="search",
        description="Search",
        parameters={"type": "object", "properties": {"query": {"type": "string"}}},
    )


class _OpenAICompletions:
    def __init__(self, response: SimpleNamespace | None = None) -> None:
        self.params = None
        self.response = response

    def create(self, **params):
        self.params = params
        if self.response:
            return self.response
        return _openai_response(model=params["model"])


class _OpenAIClient:
    def __init__(self, response: SimpleNamespace | None = None) -> None:
        self.completions = _OpenAICompletions(response=response)
        self.chat = SimpleNamespace(completions=self.completions)


class _Responses:
    def __init__(self, response: SimpleNamespace) -> None:
        self.params = None
        self.response = response

    def create(self, **params):
        self.params = params
        return self.response


class _AnthropicMessages:
    def __init__(self) -> None:
        self.params = None

    def create(self, **params):
        self.params = params
        return SimpleNamespace(
            content=[SimpleNamespace(text="ok", type="text")],
            model=params["model"],
            usage=SimpleNamespace(input_tokens=1, output_tokens=1),
            stop_reason="end_turn",
        )


class _AnthropicClient:
    def __init__(self) -> None:
        self.messages = _AnthropicMessages()
        self.api_key = "test"


def _openai_response(**overrides) -> SimpleNamespace:
    defaults = {
        "choices": [SimpleNamespace(message=SimpleNamespace(content="ok", tool_calls=None), finish_reason="stop")],
        "model": "gpt-4o-mini",
        "usage": SimpleNamespace(prompt_tokens=1, completion_tokens=1, total_tokens=2),
    }
    defaults.update(overrides)
    return SimpleNamespace(**defaults)


def test_openai_provider_serializes_tools_for_chat_completions():
    provider = OpenAIProvider(api_key="test")
    client = _OpenAIClient()
    provider.client = client

    provider.generate(LLMInput(messages=[Message(role=Role.USER, content="hi")], tools=[_tool()]))

    assert client.completions.params["tools"] == [
        {
            "type": "function",
            "function": {
                "name": "search",
                "description": "Search",
                "parameters": {"type": "object", "properties": {"query": {"type": "string"}}},
                "strict": True,
            },
        }
    ]


def test_openai_provider_lists_gpt_6_astra():
    provider = OpenAIProvider(api_key="test")

    model = next(model for model in provider.list_models() if model.name == GPT_6_ASTRA_MODEL)

    assert model.provider == ProviderType.OPENAI
    assert model.supports_tools is True
    assert model.supports_vision is True
    assert model.max_tokens == 128000
    assert model.context_window == 1050000


def test_openai_provider_uses_responses_api_for_gpt_6_astra():
    provider = OpenAIProvider(api_key="test")
    response = SimpleNamespace(
        output_text="ok",
        output=[],
        model=GPT_6_ASTRA_MODEL,
        usage=SimpleNamespace(input_tokens=3, output_tokens=5, total_tokens=8),
        status="completed",
    )
    client = SimpleNamespace(responses=_Responses(response), api_key="test")
    provider.client = client

    output = provider.generate(
        LLMInput(
            messages=[Message(role=Role.USER, content="hi")],
            temperature=0.2,
            max_tokens=128,
            tools=[_tool()],
            model=GPT_6_ASTRA_MODEL,
        )
    )

    assert output.content == "ok"
    assert output.model == GPT_6_ASTRA_MODEL
    assert output.usage == {"prompt_tokens": 3, "completion_tokens": 5, "total_tokens": 8}
    assert client.responses.params == {
        "model": GPT_6_ASTRA_MODEL,
        "input": [{"role": "user", "content": "hi"}],
        "max_output_tokens": 128,
        "tools": [
            {
                "type": "function",
                "name": "search",
                "description": "Search",
                "parameters": {"type": "object", "properties": {"query": {"type": "string"}}},
                "strict": True,
            }
        ],
    }


def test_openai_provider_can_be_constructed_without_credentials(monkeypatch):
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)

    provider = OpenAIProvider()

    assert provider.validate_config() is False


def test_openai_provider_rejects_empty_or_filtered_responses():
    provider = OpenAIProvider(api_key="test")

    for response in [
        _openai_response(choices=[]),
        _openai_response(choices=[SimpleNamespace(message=None, finish_reason="content_filter")]),
    ]:
        provider.client = _OpenAIClient(response=response)
        with pytest.raises(ValueError, match=EMPTY_FILTERED_RESPONSE_ERROR):
            provider.generate(LLMInput(messages=[Message(role=Role.USER, content="hi")]))


def test_openai_provider_allows_missing_usage():
    provider = OpenAIProvider(api_key="test")
    provider.client = _OpenAIClient(response=_openai_response(usage=None))

    output = provider.generate(LLMInput(messages=[Message(role=Role.USER, content="hi")]))

    assert output.content == "ok"
    assert output.usage is None


def test_claude_provider_serializes_tools_for_messages_api():
    provider = ClaudeProvider(api_key="test")
    client = _AnthropicClient()
    provider.client = client

    provider.generate(LLMInput(messages=[Message(role=Role.USER, content="hi")], tools=[_tool()]))

    assert client.messages.params["tools"] == [
        {
            "name": "search",
            "description": "Search",
            "input_schema": {"type": "object", "properties": {"query": {"type": "string"}}},
        }
    ]
