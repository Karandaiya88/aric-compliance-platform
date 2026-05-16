const API_URL = "http://localhost:8000";

export async function getRegulations() {
  const res = await fetch(`${API_URL}/api/regulations/`);
  return res.json();
}

export async function getMAPs() {
  const res = await fetch(`${API_URL}/api/maps/`);
  return res.json();
}

export async function getDepartments() {
  const res = await fetch(`${API_URL}/api/departments/`);
  return res.json();
}

export async function runPipeline() {
  const res = await fetch(`${API_URL}/api/agents/pipeline/run`, {
    method: "POST",
  });
  return res.json();
}

export async function runValidation() {
  const res = await fetch(`${API_URL}/api/agents/validate`, {
    method: "POST",
  });
  return res.json();
}

export async function getComplianceReport() {
  const res = await fetch(`${API_URL}/api/agents/report`);
  return res.json();
}