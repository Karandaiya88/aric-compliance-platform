from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.regulation import Regulation
from schemas import RegulationCreate, RegulationUpdate, RegulationOut
import uuid

router = APIRouter()


@router.get("/", response_model=List[RegulationOut])
def get_all_regulations(
    severity: str = None,
    status: str = None,
    db: Session = Depends(get_db)
):
    """Saari regulations fetch karo — filter by severity ya status"""
    query = db.query(Regulation)
    if severity:
        query = query.filter(Regulation.severity == severity)
    if status:
        query = query.filter(Regulation.status == status)
    return query.order_by(Regulation.created_at.desc()).all()


@router.get("/{regulation_id}", response_model=RegulationOut)
def get_regulation(regulation_id: str, db: Session = Depends(get_db)):
    """Single regulation by ID"""
    reg = db.query(Regulation).filter(Regulation.id == regulation_id).first()
    if not reg:
        raise HTTPException(status_code=404, detail="Regulation not found")
    return reg


@router.post("/", response_model=RegulationOut)
def create_regulation(reg: RegulationCreate, db: Session = Depends(get_db)):
    """Naya regulation add karo"""
    db_reg = Regulation(
        id=str(uuid.uuid4()),
        **reg.dict()
    )
    db.add(db_reg)
    db.commit()
    db.refresh(db_reg)
    return db_reg


@router.patch("/{regulation_id}", response_model=RegulationOut)
def update_regulation(
    regulation_id: str,
    update: RegulationUpdate,
    db: Session = Depends(get_db)
):
    """Regulation status ya data update karo"""
    reg = db.query(Regulation).filter(Regulation.id == regulation_id).first()
    if not reg:
        raise HTTPException(status_code=404, detail="Regulation not found")
    for field, value in update.dict(exclude_unset=True).items():
        setattr(reg, field, value)
    db.commit()
    db.refresh(reg)
    return reg


@router.delete("/{regulation_id}")
def delete_regulation(regulation_id: str, db: Session = Depends(get_db)):
    """Regulation delete karo"""
    reg = db.query(Regulation).filter(Regulation.id == regulation_id).first()
    if not reg:
        raise HTTPException(status_code=404, detail="Regulation not found")
    db.delete(reg)
    db.commit()
    return {"message": "Regulation deleted successfully"}


@router.get("/stats/summary")
def get_regulations_summary(db: Session = Depends(get_db)):
    """Regulations ka summary stats"""
    total = db.query(Regulation).count()
    critical = db.query(Regulation).filter(Regulation.severity == "critical").count()
    high = db.query(Regulation).filter(Regulation.severity == "high").count()
    new = db.query(Regulation).filter(Regulation.status == "new").count()
    return {
        "total": total,
        "critical": critical,
        "high": high,
        "new_unanalyzed": new
    }
