"""
seed.py — Database mein sample data daal do
Run: python seed.py
"""
from database import SessionLocal, engine, Base
from models.regulation import Regulation
from models.map_model import MAP
import uuid

# Tables create karo
Base.metadata.create_all(bind=engine)

db = SessionLocal()

# ─── Clear existing data ──────────────────────────
db.query(MAP).delete()
db.query(Regulation).delete()
db.commit()

# ─── Regulations ─────────────────────────────────
regulations = [
    Regulation(
        id="reg-001",
        ref_id="BCBS-SEP-2025-044",
        source="Basel Committee",
        title="Basel IV Final Rule: Revised Capital Adequacy Requirements for Operational Risk",
        excerpt="Banks must implement the Standardised Approach for Operational Risk (SA-OR) by Q1 2026. Internal models approach is no longer permitted. Minimum capital floors apply at 72.5%.",
        severity="critical",
        score=9.2,
        departments="Risk Management,Compliance,IT & Security",
        published_at="Sep 18, 2025",
        deadline="Mar 31, 2026",
        days_left=143,
        maps_generated=4,
        status="in-progress"
    ),
    Regulation(
        id="reg-002",
        ref_id="FED-SR-2025-6",
        source="Federal Reserve",
        title="Enhanced Prudential Standards: Stress Testing & Recovery Planning for Large BHCs",
        excerpt="Large BHCs with >$100B in assets must expand stress testing to include climate risk, cyber shocks, and geopolitical tail events. Annual submission to Fed required.",
        severity="high",
        score=7.8,
        departments="Risk Management,Legal",
        published_at="Oct 02, 2025",
        deadline="Jun 30, 2026",
        days_left=233,
        maps_generated=3,
        status="mapped"
    ),
    Regulation(
        id="reg-003",
        ref_id="DORA-2025-ITS-03",
        source="European Banking Authority",
        title="DORA ICT Third-Party Risk Management: Contractual Arrangements & Register Requirements",
        excerpt="All EU financial entities must maintain a complete register of ICT third-party service providers. Critical providers must be notified to regulators.",
        severity="high",
        score=7.1,
        departments="IT & Security,Legal,Operations",
        published_at="Oct 11, 2025",
        deadline="Jan 17, 2027",
        days_left=614,
        maps_generated=5,
        status="in-progress"
    ),
]

for reg in regulations:
    db.add(reg)
db.commit()
print(f"✅ {len(regulations)} Regulations added")

# ─── MAPs ─────────────────────────────────────────
maps = [
    MAP(
        id="MAP-2025-0441",
        regulation_id="reg-001",
        regulation_ref="BCBS-SEP-2025-044",
        action="Implement SA-OR capital calculation model replacing all internal model outputs",
        department="Risk Management",
        assignee="James T.",
        metric="Model in prod + 3-quarter backtest report",
        deadline="Mar 31, 2026",
        status="validated",
        progress=100,
        evidence="SA-OR model v2.1 deployed 2025-10-14 | Backtested 3 quarters | CFO validated",
        validated_at="2025-10-14",
        validated_by="Validator Agent",
        priority="critical"
    ),
    MAP(
        id="MAP-2025-0442",
        regulation_id="reg-001",
        regulation_ref="BCBS-SEP-2025-044",
        action="Update capital floor to enforce 72.5% minimum of standardised outputs across all portfolios",
        department="Risk Management",
        assignee="Sarah K.",
        metric="Floor enforced in systems + CFO attestation",
        deadline="Mar 31, 2026",
        status="in-progress",
        progress=65,
        evidence="Capital floor logic in UAT · Go-live Nov 30",
        priority="critical"
    ),
    MAP(
        id="MAP-2025-0443",
        regulation_id="reg-001",
        regulation_ref="BCBS-SEP-2025-044",
        action="Recalibrate RWA reporting to exclude disallowed internal model adjustments and restate Q3 2025 figures",
        department="Compliance",
        assignee="Maria L.",
        metric="Restated Q3 report filed + auditor sign-off",
        deadline="Feb 15, 2026",
        status="pending",
        progress=22,
        evidence="Pending — owner assigned: Sarah K. (Risk Analytics)",
        priority="high"
    ),
    MAP(
        id="MAP-2025-0448",
        regulation_id="reg-002",
        regulation_ref="FED-SR-2025-6",
        action="Design and back-test climate risk stress scenario with 3C warming trajectory and 30% asset value shock",
        department="Risk Management",
        assignee="David C.",
        metric="Scenario model + backtesting report",
        deadline="Apr 30, 2026",
        status="pending",
        progress=8,
        evidence="None submitted yet — Escalation triggered",
        priority="high"
    ),
    MAP(
        id="MAP-2025-0449",
        regulation_id="reg-002",
        regulation_ref="FED-SR-2025-6",
        action="Submit cyber shock stress test scenario to Federal Reserve by Oct 31 2025 interim deadline",
        department="IT & Security",
        assignee="Priya N.",
        metric="Fed portal submission confirmed",
        deadline="Oct 31, 2025",
        status="failed",
        progress=0,
        evidence="None — Breach reported to Board Risk Committee 2025-11-01",
        priority="critical"
    ),
    MAP(
        id="MAP-2025-0455",
        regulation_id="reg-003",
        regulation_ref="DORA-2025-ITS-03",
        action="Compile complete ICT third-party register with contractual details, risk tier, and substitutability assessment",
        department="IT & Security",
        assignee="Priya N.",
        metric="Register v3.0 uploaded | Legal sign-off received",
        deadline="Jan 17, 2026",
        status="validated",
        progress=100,
        evidence="Register v3.0 uploaded 2025-11-02 | 247 providers logged | Legal sign-off received",
        validated_at="2025-11-02",
        validated_by="Validator Agent",
        priority="high"
    ),
]

for m in maps:
    db.add(m)
db.commit()
print(f"✅ {len(maps)} MAPs added")

db.close()
print("\n🎉 Database seeded successfully!")
print("Now run: uvicorn main:app --reload")
