from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models.map_model import MAP
from schemas import MAPCreate, MAPUpdate, MAPOut
import uuid
from datetime import datetime

router = APIRouter()


@router.get("/", response_model=List[MAPOut])
def get_all_maps(
    status: Optional[str] = None,
    department: Optional[str] = None,
    regulation_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Saare MAPs fetch karo — optional filters"""
    query = db.query(MAP)
    if status:
        query = query.filter(MAP.status == status)
    if department:
        query = query.filter(MAP.department == department)
    if regulation_id:
        query = query.filter(MAP.regulation_id == regulation_id)
    return query.order_by(MAP.created_at.desc()).all()


@router.get("/{map_id}", response_model=MAPOut)
def get_map(map_id: str, db: Session = Depends(get_db)):
    """Single MAP by ID"""
    map_item = db.query(MAP).filter(MAP.id == map_id).first()
    if not map_item:
        raise HTTPException(status_code=404, detail="MAP not found")
    return map_item


@router.post("/", response_model=MAPOut)
def create_map(map_data: MAPCreate, db: Session = Depends(get_db)):
    """Naya MAP create karo"""
    db_map = MAP(
        id=f"MAP-{datetime.now().year}-{str(uuid.uuid4())[:4].upper()}",
        **map_data.dict()
    )
    db.add(db_map)
    db.commit()
    db.refresh(db_map)
    return db_map


@router.patch("/{map_id}", response_model=MAPOut)
def update_map(map_id: str, update: MAPUpdate, db: Session = Depends(get_db)):
    """MAP progress ya status update karo"""
    map_item = db.query(MAP).filter(MAP.id == map_id).first()
    if not map_item:
        raise HTTPException(status_code=404, detail="MAP not found")
    for field, value in update.dict(exclude_unset=True).items():
        setattr(map_item, field, value)
    db.commit()
    db.refresh(map_item)
    return map_item


@router.post("/{map_id}/validate")
def validate_map(map_id: str, db: Session = Depends(get_db)):
    """MAP ko validated mark karo — Validator Agent trigger"""
    map_item = db.query(MAP).filter(MAP.id == map_id).first()
    if not map_item:
        raise HTTPException(status_code=404, detail="MAP not found")
    map_item.status = "validated"
    map_item.progress = 100
    map_item.validated_at = datetime.now().strftime("%Y-%m-%d")
    map_item.validated_by = "Validator Agent"
    db.commit()
    db.refresh(map_item)
    return {"message": f"MAP {map_id} validated successfully", "map": map_item.id}


@router.get("/stats/by-department")
def maps_by_department(db: Session = Depends(get_db)):
    """Har department ke MAPs ka count"""
    maps = db.query(MAP).all()
    dept_stats = {}
    for m in maps:
        dept = m.department
        if dept not in dept_stats:
            dept_stats[dept] = {"total": 0, "pending": 0, "validated": 0, "failed": 0}
        dept_stats[dept]["total"] += 1
        if m.status in dept_stats[dept]:
            dept_stats[dept][m.status] += 1
    return dept_stats


@router.get("/stats/summary")
def maps_summary(db: Session = Depends(get_db)):
    """MAPs ka overall summary"""
    total = db.query(MAP).count()
    pending = db.query(MAP).filter(MAP.status == "pending").count()
    in_progress = db.query(MAP).filter(MAP.status == "in-progress").count()
    validated = db.query(MAP).filter(MAP.status == "validated").count()
    failed = db.query(MAP).filter(MAP.status == "failed").count()
    return {
        "total": total,
        "pending": pending,
        "in_progress": in_progress,
        "validated": validated,
        "failed": failed,
        "compliance_rate": round((validated / total * 100) if total > 0 else 0, 1)
    }
