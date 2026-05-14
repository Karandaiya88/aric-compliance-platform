from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.map_model import MAP

router = APIRouter()

DEPARTMENTS = [
    {"name": "Risk Management", "head": "James T.", "members": 12, "icon": "🛡️"},
    {"name": "Compliance", "head": "Maria L.", "members": 8, "icon": "⚖️"},
    {"name": "IT & Security", "head": "Priya N.", "members": 20, "icon": "💻"},
    {"name": "Legal", "head": "David C.", "members": 6, "icon": "📜"},
    {"name": "Treasury", "head": "Chen W.", "members": 9, "icon": "🏦"},
    {"name": "Operations", "head": "Anna B.", "members": 15, "icon": "⚙️"},
]


@router.get("/")
def get_departments(db: Session = Depends(get_db)):
    """Saare departments aur unka MAP workload"""
    result = []
    for dept in DEPARTMENTS:
        maps = db.query(MAP).filter(MAP.department == dept["name"]).all()
        open_maps = [m for m in maps if m.status not in ("validated", "failed")]
        overdue = [m for m in maps if m.status == "failed"]
        validated = [m for m in maps if m.status == "validated"]
        on_track = len([m for m in open_maps if m.progress >= 30])
        on_track_pct = round((on_track / len(open_maps) * 100) if open_maps else 100)
        result.append({
            **dept,
            "open_maps": len(open_maps),
            "overdue_maps": len(overdue),
            "validated_maps": len(validated),
            "on_track_percent": on_track_pct,
            "total_maps": len(maps),
        })
    return result


@router.get("/{dept_name}/maps")
def get_department_maps(dept_name: str, db: Session = Depends(get_db)):
    """Ek department ke saare MAPs"""
    maps = db.query(MAP).filter(MAP.department == dept_name).all()
    if not maps:
        return {"department": dept_name, "maps": [], "total": 0}
    return {
        "department": dept_name,
        "maps": maps,
        "total": len(maps)
    }


@router.get("/stats/workload")
def workload_summary(db: Session = Depends(get_db)):
    """Overall workload distribution across departments"""
    maps = db.query(MAP).all()
    summary = {}
    for m in maps:
        if m.department not in summary:
            summary[m.department] = 0
        summary[m.department] += 1
    return summary
