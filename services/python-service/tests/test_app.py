import pytest
from app.main import app


@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


def test_health(client):
    resp = client.get("/api/health")
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["status"] == "UP"
    assert data["service"] == "python-service"


def test_info(client):
    resp = client.get("/api/info")
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["service"] == "python-service"


def test_get_users(client):
    resp = client.get("/api/users")
    assert resp.status_code == 200
    data = resp.get_json()
    assert len(data) == 3


def test_get_user_by_id(client):
    resp = client.get("/api/users/1")
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["name"] == "Alice Johnson"


def test_get_user_not_found(client):
    resp = client.get("/api/users/999")
    assert resp.status_code == 404
