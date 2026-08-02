import os

os.environ["ENV_FILE"] = ".env.test"

import uuid

import pytest
from fastapi.testclient import TestClient

from app.main import app


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
    }