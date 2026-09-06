import os
import uuid

os.environ["ENV_FILE"] = ".env.test"

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import inspect

from app.main import app
from app.core.database import SessionLocal, engine
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
        inspector = inspect(engine)

        required_tables = {
            "skill_gap_tasks",
            "skill_gap_projects",
        }

        existing_tables = set(
            inspector.get_table_names()
        )

        missing_tables = (
            required_tables - existing_tables
        )

        if missing_tables:
            raise RuntimeError(
                "Test database schema is missing required "
                f"tables: {sorted(missing_tables)}. "
                "Run `alembic upgrade head` against "
                "the test database before running pytest."
            )

        db.query(UserAIUsage).delete()
        db.query(AIUsage).delete()
        db.commit()

        yield db

    finally:
        db.close()