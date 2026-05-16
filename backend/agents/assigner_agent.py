"""
Assigner Agent — MAPs ko sahi department assign karta hai + workload balance
"""
import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

DEPARTMENTS = [
    "Risk Management",
    "Compliance",
    "IT & Security",
    "Legal",
    "Treasury",
    "Operations"
]


def assign_map_to_department(map_action: str, regulation_source: str) -> dict:
    """Single MAP ko best department assign karo"""
    prompt = f"""You are a bank organizational expert. Assign this compliance action to the most appropriate department.

Action: {map_action}
Regulation Source: {regulation_source}

Available departments: {', '.join(DEPARTMENTS)}

Return ONLY a JSON object with:
- department: the most appropriate department name (exactly as listed)
- reason: one sentence why this department is best suited
- secondary_department: backup department if needed

Return ONLY JSON, no explanation."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": "You are a banking org structure expert. Return valid JSON only."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.2,
        max_tokens=300
    )

    raw = response.choices[0].message.content.strip()
    if "```json" in raw:
        raw = raw.split("```json")[1].split("```")[0].strip()
    elif "```" in raw:
        raw = raw.split("```")[1].split("```")[0].strip()

    return json.loads(raw)


def assign_maps_batch(maps: list, regulation: dict) -> list:
    """Saare MAPs ko batch mein assign karo"""
    prompt = f"""You are a bank organizational expert. Assign each compliance action to the most appropriate department.

Regulation: {regulation['title']} (Source: {regulation['source']})

Actions to assign:
{json.dumps([m['action'] for m in maps], indent=2)}

Available departments: {', '.join(DEPARTMENTS)}

Return ONLY a JSON array with one object per action:
[
  {{"department": "Risk Management", "reason": "...", "assignee_role": "Chief Risk Officer"}},
  ...
]

Return ONLY the JSON array."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": "You are a banking org structure expert. Return valid JSON only."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.2,
        max_tokens=800
    )

    raw = response.choices[0].message.content.strip()
    if "```json" in raw:
        raw = raw.split("```json")[1].split("```")[0].strip()
    elif "```" in raw:
        raw = raw.split("```")[1].split("```")[0].strip()

    assignments = json.loads(raw)

    # Merge assignments back into maps
    for i, map_item in enumerate(maps):
        if i < len(assignments):
            map_item["department"] = assignments[i].get("department", map_item.get("department", "Compliance"))
            map_item["assignee_role"] = assignments[i].get("assignee_role", "Department Head")
            map_item["assignment_reason"] = assignments[i].get("reason", "")

    return maps


def run_assigner_agent(maps: list, regulation: dict) -> dict:
    print(f"\n📋 Assigner Agent: Assigning {len(maps)} MAPs")
    try:
        assigned_maps = assign_maps_batch(maps, regulation)
        dept_summary = {}
        for m in assigned_maps:
            d = m.get("department", "Unknown")
            dept_summary[d] = dept_summary.get(d, 0) + 1
        print(f"✅ Assignment complete: {dept_summary}")
        return {
            "success": True,
            "maps": assigned_maps,
            "department_summary": dept_summary,
            "agent": "Assigner Agent v1.0 (Groq/Llama-3.3)"
        }
    except Exception as e:
        print(f"❌ Assigner Agent error: {e}")
        return {"success": False, "error": str(e), "maps": maps}
