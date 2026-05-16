"""
Validator Agent — MAP completion autonomously validate karta hai
"""
import os
import json
from groq import Groq
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def validate_map_evidence(map_item: dict) -> dict:
    """Evidence check karo aur validation decision lo"""
    prompt = f"""You are an autonomous compliance validator for a bank. Analyze this MAP and its evidence.

MAP Details:
- Action Required: {map_item.get('action', 'N/A')}
- Department: {map_item.get('department', 'N/A')}
- Success Metric: {map_item.get('metric', 'N/A')}
- Deadline: {map_item.get('deadline', 'N/A')}
- Current Progress: {map_item.get('progress', 0)}%
- Evidence Submitted: {map_item.get('evidence', 'No evidence submitted')}
- Current Status: {map_item.get('status', 'pending')}

Make a validation decision. Return ONLY a JSON object:
{{
  "decision": "validated" | "needs_review" | "failed" | "in_progress",
  "confidence": 0-100,
  "reason": "one sentence explanation",
  "recommended_progress": 0-100,
  "escalate": true | false,
  "escalation_reason": "reason if escalate is true, else null"
}}

Return ONLY the JSON object."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": "You are a strict banking compliance validator. Return valid JSON only."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.1,
        max_tokens=400
    )

    raw = response.choices[0].message.content.strip()
    if "```json" in raw:
        raw = raw.split("```json")[1].split("```")[0].strip()
    elif "```" in raw:
        raw = raw.split("```")[1].split("```")[0].strip()

    return json.loads(raw)


def run_validation_sweep(maps: list) -> dict:
    """Saare open MAPs ko validate karo"""
    print(f"\n✅ Validator Agent: Sweeping {len(maps)} MAPs")

    results = []
    auto_validated = []
    escalated = []
    needs_review = []

    for map_item in maps:
        # Skip already validated/failed
        if map_item.get("status") in ("validated", "failed"):
            continue

        try:
            validation = validate_map_evidence(map_item)
            decision = validation.get("decision", "needs_review")

            result = {
                "map_id": map_item.get("id"),
                "map_action": map_item.get("action", "")[:80],
                "decision": decision,
                "confidence": validation.get("confidence", 0),
                "reason": validation.get("reason", ""),
                "recommended_progress": validation.get("recommended_progress", map_item.get("progress", 0)),
                "escalate": validation.get("escalate", False),
                "timestamp": datetime.now().isoformat()
            }

            if decision == "validated":
                auto_validated.append(map_item.get("id"))
            elif validation.get("escalate"):
                escalated.append(map_item.get("id"))
            else:
                needs_review.append(map_item.get("id"))

            results.append(result)
            print(f"  → {map_item.get('id')}: {decision} ({validation.get('confidence', 0)}% confidence)")

        except Exception as e:
            print(f"  ❌ Error validating {map_item.get('id')}: {e}")

    print(f"✅ Sweep complete: {len(auto_validated)} validated, {len(escalated)} escalated")

    return {
        "success": True,
        "sweep_timestamp": datetime.now().isoformat(),
        "maps_checked": len(results),
        "auto_validated": len(auto_validated),
        "auto_validated_ids": auto_validated,
        "escalated": len(escalated),
        "escalated_ids": escalated,
        "needs_review": len(needs_review),
        "results": results,
        "agent": "Validator Agent v1.0 (Groq/Llama-3.3)"
    }


def generate_compliance_report(maps: list, regulations: list) -> str:
    """Full compliance report generate karo"""
    validated = [m for m in maps if m.get("status") == "validated"]
    failed = [m for m in maps if m.get("status") == "failed"]
    pending = [m for m in maps if m.get("status") == "pending"]

    prompt = f"""You are a Chief Compliance Officer writing a board-level compliance report.

Current Status:
- Total MAPs: {len(maps)}
- Validated: {len(validated)}
- Failed/Overdue: {len(failed)}
- Pending: {len(pending)}
- Active Regulations: {len(regulations)}
- Compliance Score: {round(len(validated)/len(maps)*100 if maps else 0, 1)}%

Write a concise 3-paragraph executive compliance summary:
1. Overall compliance posture
2. Key risks and overdue items
3. Recommended immediate actions

Keep it professional, specific, and under 200 words."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": "You are a Chief Compliance Officer writing executive reports."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.4,
        max_tokens=500
    )

    return response.choices[0].message.content.strip()
