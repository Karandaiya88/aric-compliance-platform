"""
Monitor Agent — Regulatory sources monitor karta hai + new regulations detect karta hai
"""
import os
import json
from groq import Groq
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

REGULATORY_SOURCES = [
    "Basel Committee (BCBS)",
    "Federal Reserve (Fed)",
    "European Banking Authority (EBA)",
    "Financial Crimes Enforcement Network (FinCEN)",
    "Digital Operational Resilience Act (DORA)",
    "Securities and Exchange Commission (SEC)",
    "Office of the Comptroller of the Currency (OCC)",
    "Financial Stability Oversight Council (FSOC)",
]


def generate_sample_regulation() -> dict:
    """
    Demo mode: AI se ek realistic naya regulation generate karo
    Production mein: real RSS feeds / regulatory websites scrape karenge
    """
    prompt = f"""You are a regulatory intelligence system. Generate ONE realistic new banking regulation notice.

Current date: {datetime.now().strftime('%B %Y')}
Sources to choose from: {', '.join(REGULATORY_SOURCES)}

Return ONLY a JSON object with these exact fields:
{{
  "ref_id": "regulatory reference number like OCC-2025-NR-42",
  "source": "regulatory body name",
  "title": "regulation title",
  "excerpt": "2-3 sentence summary of requirements",
  "severity": "critical" | "high" | "medium",
  "score": 6.0-9.5 as number,
  "departments": "comma-separated list of 2-3 affected departments from: Risk Management, Compliance, IT & Security, Legal, Treasury, Operations",
  "published_at": "recent month and year",
  "deadline": "future date in 2026",
  "days_left": realistic number of days
}}

Return ONLY the JSON object. Make it realistic and specific to banking compliance."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": "You are a regulatory intelligence AI. Return valid JSON only."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=600
    )

    raw = response.choices[0].message.content.strip()
    if "```json" in raw:
        raw = raw.split("```json")[1].split("```")[0].strip()
    elif "```" in raw:
        raw = raw.split("```")[1].split("```")[0].strip()

    reg = json.loads(raw)
    reg["status"] = "new"
    reg["maps_generated"] = 0
    return reg


def run_monitor_agent() -> dict:
    """Monitor Agent — naya regulation detect karo"""
    print("\n🔍 Monitor Agent: Scanning regulatory feeds...")
    try:
        regulation = generate_sample_regulation()
        print(f"✅ New regulation detected: {regulation.get('ref_id')}")
        return {
            "success": True,
            "regulation": regulation,
            "sources_checked": len(REGULATORY_SOURCES),
            "detected_at": datetime.now().isoformat(),
            "agent": "Monitor Agent v1.0 (Groq/Llama-3.3)"
        }
    except Exception as e:
        print(f"❌ Monitor Agent error: {e}")
        return {"success": False, "error": str(e)}


def analyze_regulation_severity(regulation: dict) -> dict:
    """Regulation ka severity score calculate karo"""
    prompt = f"""Analyze this banking regulation and provide a risk assessment.

Regulation: {regulation.get('title')}
Source: {regulation.get('source')}
Content: {regulation.get('excerpt')}

Return ONLY a JSON object:
{{
  "severity": "critical" | "high" | "medium" | "low",
  "score": 1.0-10.0,
  "risk_factors": ["factor1", "factor2", "factor3"],
  "estimated_implementation_days": number,
  "departments_impacted": number
}}"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": "You are a banking risk assessment AI. Return valid JSON only."},
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
