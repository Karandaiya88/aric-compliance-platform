from sqlalchemy import Column, String, Float, Integer, Text, DateTime
from sqlalchemy.sql import func
from database import Base


class Regulation(Base):
    __tablename__ = "regulations"

    id = Column(String, primary_key=True, index=True)
    ref_id = Column(String, unique=True, index=True)
    source = Column(String)
    title = Column(String)
    excerpt = Column(Text)
    full_text = Column(Text, nullable=True)
    severity = Column(String)           # critical | high | medium | low
    score = Column(Float)
    departments = Column(String)        # comma-separated list
    published_at = Column(String)
    deadline = Column(String)
    days_left = Column(Integer)
    maps_generated = Column(Integer, default=0)
    status = Column(String, default="new")   # new | analyzing | mapped | in-progress | closed
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
