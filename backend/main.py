from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import regulations, maps, departments, validation

app = FastAPI(
    title="ARIC — Agentic Regulatory Intelligence & Compliance",
    description="AI-powered regulatory monitoring and compliance management for banks",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(regulations.router, prefix="/api/regulations", tags=["Regulations"])
app.include_router(maps.router, prefix="/api/maps", tags=["MAPs"])
app.include_router(departments.router, prefix="/api/departments", tags=["Departments"])
app.include_router(validation.router, prefix="/api/validation", tags=["Validation"])

@app.get("/")
def root():
    return {"message": "ARIC API is running", "version": "1.0.0"}

@app.get("/health")
def health():
    return {"status": "healthy", "agents": 4, "active": True}
