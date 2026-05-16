"""
Agents Router — Frontend se AI agents trigger karne ke liye APIs
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.regulation import Regulation
from models.map_model import MAP
from agents import (
    run_parser_agent,
    run_assigner_agent,
    run_validation_sweep,
    run_monitor_agent,
    generate_compliance_report
)
import uuid
from datetime import datetime

router = APIRouter()


@router.post("/monitor")
def trigger_monitor_agent(db: Session = Depends(get_db)):
    """Monitor Agent — Naya regulation detect karo"""
    result = run_monitor_agent()
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result.get("error"))

    reg_data = result["regulation"]
    existing = db.query(Regulation).filter(Regulation.ref_id == reg_data.get("ref_id")).first()
    if existing:
        return {"message": "Already exists", "regulation_id": existing.id, "duplicate": True}

    new_reg = Regulation(
        id=str(uuid.uuid4()),
        ref_id=reg_data.get("ref_id", f"REG-{uuid.uuid4().hex[:8].upper()}"),
        source=reg_data.get("source", "Unknown"),
        title=reg_data.get("title", ""),
        excerpt=reg_data.get("excerpt", ""),
        severity=reg_data.get("severity", "medium"),
        score=float(reg_data.get("score", 5.0)),
        departments=reg_data.get("departments", "Compliance"),
        published_at=reg_data.get("published_at", datetime.now().strftime("%b %Y")),
        deadline=reg_data.get("deadline", "Dec 31, 2026"),
        days_left=int(reg_data.get("days_left", 365)),
        maps_generated=0,
        status="new"
    )
    db.add(new_reg)
    db.commit()
    db.refresh(new_reg)
    return {
        "message": "New regulation detected and saved",
        "regulation_id": new_reg.id,
        "regulation_ref": new_reg.ref_id,
        "severity": new_reg.severity,
        "agent": result.get("agent")
    }


@router.post("/parse/{regulation_id}")
def trigger_parser_agent(regulation_id: str, db: Session = Depends(get_db)):
    """Parser Agent — AI se MAPs generate karo"""
    reg = db.query(Regulation).filter(Regulation.id == regulation_id).first()
    if not reg:
        raise HTTPException(status_code=404, detail="Regulation not found")

    reg_dict = {"id": reg.id, "ref_id": reg.ref_id, "title": reg.title,
                "source": reg.source, "excerpt": reg.excerpt,
                "severity": reg.severity, "deadline": reg.deadline}

    parse_result = run_parser_agent(reg_dict)
    if not parse_result["success"]:
        raise HTTPException(status_code=500, detail=parse_result.get("error"))

    assign_result = run_assigner_agent(parse_result["maps"], reg_dict)
    final_maps = assign_result.get("maps", parse_result["maps"])

    saved_maps = []
    for map_data in final_maps:
        new_map = MAP(
            id=f"MAP-{datetime.now().year}-{uuid.uuid4().hex[:6].upper()}",
            regulation_id=reg.id,
            regulation_ref=reg.ref_id,
            action=map_data.get("action", ""),
            department=map_data.get("department", "Compliance"),
            metric=map_data.get("metric", ""),
            deadline=map_data.get("deadline", reg.deadline),
            status="pending",
            progress=int(map_data.get("progress", 0)),
            priority=map_data.get("priority", "medium"),
        )
        db.add(new_map)
        saved_maps.append(new_map.id)

    reg.status = "mapped"
    reg.maps_generated = len(saved_maps)
    db.commit()

    return {
        "message": f"{len(saved_maps)} MAPs generated",
        "regulation_ref": reg.ref_id,
        "maps_created": saved_maps,
        "department_summary": assign_result.get("department_summary", {})
    }


@router.post("/validate")
def trigger_validator_agent(db: Session = Depends(get_db)):
    """Validator Agent — Autonomous validation sweep"""
    open_maps = db.query(MAP).filter(MAP.status.in_(["pending", "in-progress"])).all()
    if not open_maps:
        return {"message": "No open MAPs", "maps_checked": 0}

    maps_list = [{"id": m.id, "action": m.action, "department": m.department,
                  "metric": m.metric, "deadline": m.deadline, "status": m.status,
                  "progress": m.progress, "evidence": m.evidence or "No evidence"} for m in open_maps]

    result = run_validation_sweep(maps_list)

    for validation in result.get("results", []):
        map_item = db.query(MAP).filter(MAP.id == validation["map_id"]).first()
        if map_item:
            if validation["decision"] == "validated":
                map_item.status = "validated"
                map_item.progress = 100
                map_item.validated_at = datetime.now().strftime("%Y-%m-%d")
                map_item.validated_by = "Validator Agent (Auto)"
            elif validation["decision"] == "failed":
                map_item.status = "failed"
            else:
                map_item.progress = validation.get("recommended_progress", map_item.progress)

    db.commit()
    return {"message": "Validation sweep complete", **result}


@router.post("/pipeline/run")
def run_full_pipeline(db: Session = Depends(get_db)):
    """Full Pipeline: Monitor → Parser → Assigner → Validator"""
    log = []

    log.append("🔍 Monitor Agent scanning...")
    monitor = run_monitor_agent()
    if not monitor["success"]:
        return {"success": False, "error": "Monitor failed", "log": log}

    reg_data = monitor["regulation"]
    log.append(f"✅ Detected: {reg_data.get('ref_id')}")

    new_reg = Regulation(
        id=str(uuid.uuid4()),
        ref_id=reg_data.get("ref_id", f"REG-{uuid.uuid4().hex[:8].upper()}"),
        source=reg_data.get("source", "Unknown"),
        title=reg_data.get("title", ""),
        excerpt=reg_data.get("excerpt", ""),
        severity=reg_data.get("severity", "medium"),
        score=float(reg_data.get("score", 5.0)),
        departments=reg_data.get("departments", "Compliance"),
        published_at=reg_data.get("published_at", datetime.now().strftime("%b %Y")),
        deadline=reg_data.get("deadline", "Dec 31, 2026"),
        days_left=int(reg_data.get("days_left", 365)),
        maps_generated=0, status="new"
    )
    db.add(new_reg)
    db.commit()

    log.append("🧠 Parser Agent generating MAPs...")
    reg_dict = {"id": new_reg.id, "ref_id": new_reg.ref_id, "title": new_reg.title,
                "source": new_reg.source, "excerpt": new_reg.excerpt,
                "severity": new_reg.severity, "deadline": new_reg.deadline}

    parse_result = run_parser_agent(reg_dict)
    if not parse_result["success"]:
        return {"success": False, "error": "Parser failed", "log": log}

    log.append(f"✅ {parse_result['maps_generated']} MAPs generated")
    log.append("📋 Assigner Agent routing...")

    assign_result = run_assigner_agent(parse_result["maps"], reg_dict)
    final_maps = assign_result.get("maps", parse_result["maps"])

    saved = []
    for map_data in final_maps:
        new_map = MAP(
            id=f"MAP-{datetime.now().year}-{uuid.uuid4().hex[:6].upper()}",
            regulation_id=new_reg.id, regulation_ref=new_reg.ref_id,
            action=map_data.get("action", ""), department=map_data.get("department", "Compliance"),
            metric=map_data.get("metric", ""), deadline=map_data.get("deadline", new_reg.deadline),
            status="pending", progress=int(map_data.get("progress", 0)),
            priority=map_data.get("priority", "medium"),
        )
        db.add(new_map)
        saved.append(new_map.id)

    new_reg.status = "mapped"
    new_reg.maps_generated = len(saved)
    db.commit()

    log.append(f"✅ Assigned: {assign_result.get('department_summary', {})}")
    log.append("🎉 Pipeline complete!")

    return {
        "success": True,
        "log": log,
        "regulation": {"id": new_reg.id, "ref_id": new_reg.ref_id, "title": new_reg.title},
        "maps_created": len(saved),
        "department_summary": assign_result.get("department_summary", {})
    }


@router.get("/report")
def get_compliance_report(db: Session = Depends(get_db)):
    """AI se executive compliance report generate karo"""
    maps = db.query(MAP).all()
    regulations = db.query(Regulation).all()
    maps_list = [{"id": m.id, "action": m.action, "status": m.status, "progress": m.progress} for m in maps]
    regs_list = [{"ref_id": r.ref_id, "title": r.title, "severity": r.severity} for r in regulations]
    report = generate_compliance_report(maps_list, regs_list)
    return {"report": report, "generated_at": datetime.now().isoformat(),
            "total_maps": len(maps), "total_regulations": len(regulations)}
