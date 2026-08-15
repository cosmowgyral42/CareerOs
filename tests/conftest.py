import os
import uuid

os.environ["ENV_FILE"] = ".env.test"

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.core.database import SessionLocal


@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def test_user():
    return {
        "full_name": "Test User",
        "email": f"test-{uuid.uuid4()}@example.com",
        "password": "TestPassword123!",
        "timezone": "Asia/Kolkata",
    }

@pytest.fixture
def db_session():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()