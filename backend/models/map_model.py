from sqlalchemy import Column, String, Integer, Text, DateTime
from sqlalchemy.sql import func
from database import Base


class MAP(Base):
    __tablename__ = "maps"

    id = Column(String, primary_key=True, index=True)
    regulation_id = Column(String, index=True)
    regulation_ref = Column(String)
    action = Column(Text)
    description = Column(Text, nullable=True)
    department = Column(String)
    assignee = Column(String, nullable=True)
    metric = Column(String)
    deadline = Column(String)
    status = Column(String, default="pending")   # pending | in-progress | validated | failed | overdue
    progress = Column(Integer, default=0)
    evidence = Column(Text, nullable=True)
    validated_at = Column(String, nullable=True)
    validated_by = Column(String, nullable=True)
    priority = Column(String, default="medium")  # critical | high | medium | low
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
