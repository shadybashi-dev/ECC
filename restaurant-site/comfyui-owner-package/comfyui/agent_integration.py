#!/usr/bin/env python3
"""
Agent-to-ComfyUI Integration Layer
Intelligent agent that reads Antonia's menu data, SEO rules, and generates ComfyUI workflows

This is the brain that the AI agent uses to drive ComfyUI — it understands:
- Menu categories: Star/Puzzle/Plowhorse/Dog (conversion psychology)
- SEO naming formula: [dish]-[feature]-[city]-[restaurant].ext
- Truth-in-menu: matches official menu doc mozzarella/feta Ajarski 28-inch
- Visual rules: 45-degree diner angle, 10 o'clock soft window light, leopard-charring, olive oil shine, steam
- Technical: WebP/AVIF <60K hero <150K, 800x800 menu, 1920x1080 hero, 1200x900 bento

Usage:
  python agent_integration.py --analyze-menu
  python agent_integration.py --generate-prompts --category Star
  python agent_integration.py --queue --workflow flux --slot antonias-special
"""

import json
import argparse
from pathlib import Path
import sys

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent / "antonias"

class AntoniasFoodAgent:
    """
    الوكيل الذكي — يقرأ بيانات القائمة والـ SEO ويولد برومبتات سينمائية واقعية
    """

    def __init__(self, slots_path=None):
        self.slots_path = Path(slots_path) if slots_path else HERE / "slots_v2.json"
        self.slots_data = json.loads(self.slots_path.read_text())
        self.style_suffix = self.slots_data.get('style_suffix','')
        self.negative = self.slots_data.get('negative','')

    def analyze_menu(self):
        """تحليل القائمة حسب سيكولوجية التحويل Star/Puzzle/Plowhorse/Dog"""
        print("🍕 Antonia's Menu Analysis — Conversion Psychology")
        print("="*70)
        categories = {}
        for slot in self.slots_data.get('slots', []):
            cat = slot.get('category','Unknown')
            categories.setdefault(cat, []).append(slot['id'])

        for cat, ids in categories.items():
            print(f"\n{cat}: {len(ids)} items")
            for i in ids:
                print(f"  - {i}")

        print("\n📊 SEO Rules:")
        for k, v in self.slots_data.get('seo_rules', {}).items():
            print(f"  {k}: {v}")

        print("\n💡 Agent Recommendations:")
        print("  - Star (Ajarski, 28-inch, Antonia's Special) -> Top of menu, large visuals, sensory language")
        print("  - Puzzle (Calzone, Pasta vegan) -> Educational, unique, 4 versions only Higuera")
        print("  - Plowhorse (Margherita, BBQ Chicken) -> Reliable, classic, high volume")
        print("  - Price Anchor: 28-inch King monster 615 sq in 6-8 people +6.8% AOV")

    def generate_prompts(self, category_filter=None):
        """Generate cinematic prompts for ComfyUI"""
        print(f"🎬 Generating cinematic prompts {'for '+category_filter if category_filter else 'for all'}")
        print("="*70)
        for slot in self.slots_data.get('slots', []):
            if category_filter and category_filter.lower() not in slot.get('category','').lower():
                continue

            # Build full positive prompt with technical specs
            positive = slot['prompt']
            if self.style_suffix not in positive:
                positive = f"{positive}, {self.style_suffix}"

            # Add camera & lighting specs per Food Photography best practices
            camera_specs = "45-degree diner angle, soft directional morning window light from 10 o'clock, dark slate rustic table, shot on Sony A7R V 85mm f/2.8 lens, hyper-detailed texture, depth of field, appetizing, restaurant menu quality, 8k resolution"

            # Color grading specs (warm natural)
            grading_specs = "warm natural grading golden caramelized crust, rich red tomato sauce, ivory creamy mozzarella with light browning, micro-contrast leopard-charring olive oil shine steam, soft daylight 45-degree"

            full_prompt = f"{positive}, {camera_specs}, {grading_specs}"

            print(f"\n🍕 {slot['id']} — {slot['seo_name']} [{slot.get('category','')}]")
            print(f"   Dimensions: {slot['width']}x{slot['height']} File: {slot['file']}")
            print(f"   Positive: {full_prompt[:200]}...")
            print(f"   Negative: {slot.get('negative_override', self.negative)[:150]}...")
            print(f"   FLUX CFG: {slot.get('flux_cfg', 4.0)} Steps: {slot.get('flux_steps', 32)} Sampler: {slot.get('sampler','euler')}/{slot.get('scheduler','simple')}")

    def get_slot_by_id(self, slot_id):
        for s in self.slots_data.get('slots', []):
            if s['id'] == slot_id or s['seo_name'] == slot_id:
                return s
        return None

    def build_comfy_payload(self, slot_id, workflow_data, seed=None):
        """Build ComfyUI API payload for a slot — Agent injects prompt + dimensions + seed"""
        import uuid
        slot = self.get_slot_by_id(slot_id)
        if not slot:
            raise ValueError(f"Slot {slot_id} not found")

        # Deep copy workflow
        wf = json.loads(json.dumps(workflow_data))
        if seed is None:
            seed = int(uuid.uuid4()) % 2**32

        # Inject as per architecture
        clip_nodes = [k for k,v in wf.items() if not k.startswith('_') and v.get('class_type')=='CLIPTextEncode']
        clip_nodes_sorted = sorted(clip_nodes, key=lambda x: int(x) if x.isdigit() else 999)
        if len(clip_nodes_sorted)>=2:
            pos_node, neg_node = clip_nodes_sorted[0], clip_nodes_sorted[1]
            wf[pos_node]['inputs']['text'] = slot['prompt'] + ", " + self.style_suffix
            wf[neg_node]['inputs']['text'] = slot.get('negative_override', self.negative)

        for k,v in wf.items():
            if k.startswith('_'): continue
            if v.get('class_type')=='EmptyLatentImage':
                wf[k]['inputs']['width']=slot['width']
                wf[k]['inputs']['height']=slot['height']
            if v.get('class_type')=='KSampler':
                wf[k]['inputs']['seed']=seed
                if 'flux_cfg' in slot:
                    wf[k]['inputs']['cfg']=slot['flux_cfg']
                if 'flux_steps' in slot:
                    wf[k]['inputs']['steps']=slot['flux_steps']

        print(f"✅ Agent injected: prompt + {slot['width']}x{slot['height']} + seed {seed} into workflow for {slot_id}")
        return wf

def main():
    ap = argparse.ArgumentParser(description="Antonia's Food Agent — ComfyUI Integration")
    ap.add_argument("--analyze-menu", action="store_true", help="Analyze menu by conversion psychology")
    ap.add_argument("--generate-prompts", action="store_true", help="Generate cinematic prompts")
    ap.add_argument("--category", default=None, help="Filter by category Star/Puzzle/Plowhorse")
    ap.add_argument("--slots", default=None, help="Slots JSON path")
    ap.add_argument("--slot", default=None, help="Get single slot details")
    args = ap.parse_args()

    agent = AntoniasFoodAgent(slots_path=args.slots)

    if args.analyze_menu:
        agent.analyze_menu()
    elif args.generate_prompts:
        agent.generate_prompts(category_filter=args.category)
    elif args.slot:
        slot = agent.get_slot_by_id(args.slot)
        if slot:
            print(json.dumps(slot, indent=2, ensure_ascii=False))
        else:
            print(f"Slot {args.slot} not found")
            return 1
    else:
        agent.analyze_menu()
        print("\n")
        agent.generate_prompts()

    return 0

if __name__ == "__main__":
    sys.exit(main())
