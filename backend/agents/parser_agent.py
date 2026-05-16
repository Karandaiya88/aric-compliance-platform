"""
Parser Agent — Groq AI se regulation text parse karke MAPs generate karta hai
"""
import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def parse_regulation_to_maps(regulation: dict) -> list:
    prompt = f"""You are a senior banking compliance expert. Analyze this regulation and generate exactly 4 Measurable Action Points (MAPs).

REGULATION:
Title: {regulation['title']}
Source: {regulation['source']}
Content: {regulation['excerpt']}
Deadline: {regulation['deadline']}
Severity: {regulation['severity']}

Generate exactly 4 MAPs. Return ONLY a valid JSON array, no other text.
Each MAP must have:
- action: specific measurable action the bank must take (1-2 sentences)
- department: one of [Risk Management, Compliance, IT & Security, Legal, Treasury, Operations]
- metric: how completion will be measured (short phrase)
- deadline: realistic deadline before {regulation['deadline']}
- priority: one of [critical, high, medium, low]
- progress: starting progress 0-10

Return ONLY the JSON array. No explanation."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": "You are a banking compliance AI. Always respond with valid JSON only. No markdown, no explanation."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3,
        max_tokens=1500
    )

    raw = response.choices[0].message.content.strip()

    # Clean markdown if present
    if "```json" in raw:
        raw = raw.split("```json")[1].split("```")[0].strip()
    elif "```" in raw:
        raw = raw.split("```")[1].split("```")[0].strip()

    maps = json.loads(raw)
    return maps


def run_parser_agent(regulation: dict) -> dict:
    print(f"\n🧠 Parser Agent: {regulation['ref_id']}")
    try:
        maps = parse_regulation_to_maps(regulation)
        print(f"✅ {len(maps)} MAPs generated")
        return {
            "success": True,
            "regulation_id": regulation["id"],
            "regulation_ref": regulation["ref_id"],
            "maps_generated": len(maps),
            "maps": maps,
            "agent": "Parser Agent v1.0 (Groq/Llama-3.3)"
        }
    except Exception as e:
        print(f"❌ Parser Agent error: {e}")
        return {"success": False, "error": str(e), "regulation_id": regulation.get("id", "unknown")}
