from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# ─── Regulation Schemas ───────────────────────────

class RegulationBase(BaseModel):
    ref_id: str
    source: str
    title: str
    excerpt: str
    severity: str
    score: float
    departments: str
    published_at: str
    deadline: str
    days_left: int

class RegulationCreate(RegulationBase):
    full_text: Optional[str] = None

class RegulationUpdate(BaseModel):
    status: Optional[str] = None
    maps_generated: Optional[int] = None
    days_left: Optional[int] = None

class RegulationOut(RegulationBase):
    id: str
    maps_generated: int
    status: str
    full_text: Optional[str] = None

    class Config:
        from_attributes = True


# ─── MAP Schemas ──────────────────────────────────

class MAPBase(BaseModel):
    regulation_id: str
    regulation_ref: str
    action: str
    department: str
    metric: str
    deadline: str
    priority: str = "medium"

class MAPCreate(MAPBase):
    description: Optional[str] = None
    assignee: Optional[str] = None

class MAPUpdate(BaseModel):
    status: Optional[str] = None
    progress: Optional[int] = None
    evidence: Optional[str] = None
    assignee: Optional[str] = None
    validated_at: Optional[str] = None
    validated_by: Optional[str] = None

class MAPOut(MAPBase):
    id: str
    status: str
    progress: int
    evidence: Optional[str] = None
    assignee: Optional[str] = None
    validated_at: Optional[str] = None
    validated_by: Optional[str] = None
    description: Optional[str] = None

    class Config:
        from_attributes = True


# ─── Dashboard Schema ─────────────────────────────

class DashboardStats(BaseModel):
    total_regulations: int
    critical_alerts: int
    pending_maps: int
    validated_this_month: int
    compliance_score: float
    overdue_maps: int
    agents_active: int
