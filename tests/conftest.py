import os
import uuid

os.environ["ENV_FILE"] = ".env.test"

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.core.database import SessionLocal
from app.models.ai_usage import AIUsage
from app.models.user_ai_usage import UserAIUsage


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
        # Keep AI quota tests isolated from each other.
        # Each test should start with a clean daily quota.
        db.query(UserAIUsage).delete()
        db.query(AIUsage).delete()
        db.commit()

        yield db

    finally:
        db.close()