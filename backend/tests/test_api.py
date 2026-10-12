import os
os.environ["DATABASE_URL"] = "sqlite:///./test.db"

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db import Base, engine

# Create tables in test database
Base.metadata.create_all(bind=engine)

@pytest.fixture(scope="session")
def client():
    with TestClient(app) as c:
        yield c

def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "UP"}

def test_ready(client):
    response = client.get("/ready")
    assert response.status_code == 200
    assert response.json() == {"status": "READY"}

def test_root(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["service"] == "TaskBoard API"

def test_create_and_get_task(client):
    create_res = client.post("/api/tasks", json={
        "title": "Deploy to Kubernetes",
        "description": "Production Helm chart deployment",
        "priority": "HIGH",
        "assignee": "Raghav Rathi"
    })
    assert create_res.status_code == 201
    task = create_res.json()
    assert task["title"] == "Deploy to Kubernetes"
    assert task["assignee"] == "Raghav Rathi"

    get_res = client.get(f"/api/tasks/{task['id']}")
    assert get_res.status_code == 200
    assert get_res.json()["assignee"] == "Raghav Rathi"

def test_list_tasks(client):
    response = client.get("/api/tasks")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) >= 1

def test_tasks_stats(client):
    response = client.get("/api/tasks/stats")
    assert response.status_code == 200
    stats = response.json()
    assert "total" in stats
    assert "todo" in stats
    assert "inProgress" in stats
    assert "done" in stats
    assert stats["total"] >= 1
