from datetime import date
from unittest.mock import patch
from app.core.exceptions import AIProviderUnavailableError
import pytest

from app.models.ai_usage import AIUsage
from app.models.career_target import CareerTarget
from app.models.user import User
from app.repositories import ai_usage_repository


def test_career_recommendations_requires_auth(client):
    response = client.get(
        "/api/v1/career-recommendations",
    )

    assert response.status_code == 401


def test_create_career_recommendation_requires_auth(client):
    response = client.post(
        "/api/v1/career-recommendations",
        json={
            "career_target_id": None,
            "recommendation_type": "skill_gap",
            "title": "Learn Docker",
            "description": "Learn Docker fundamentals for backend engineering.",
            "priority": "high",
        },
    )

    assert response.status_code == 401


def test_complete_career_recommendation_requires_auth(client):
    response = client.patch(
        "/api/v1/career-recommendations/1/complete",
    )

    assert response.status_code == 401


def test_career_fit_analyze_requires_auth(client):
    response = client.post(
        "/api/v1/career-recommendations/analyze",
        json={
            "career_target_id": 1,
            "job_description": (
                "We are looking for a Python backend developer "
                "with FastAPI, PostgreSQL, Docker, and REST API experience. "
                "The candidate should also understand authentication, "
                "database design, testing, and backend development."
            ),
        },
    )

    assert response.status_code == 401


def test_career_fit_analyze_invalid_career_target(
    client,
    test_user,
):
    register_response = client.post(
        "/api/v1/auth/register",
        json=test_user,
    )

    assert register_response.status_code == 201

    login_response = client.post(
        "/api/v1/auth/login",
        data={
            "username": test_user["email"],
            "password": test_user["password"],
        },
    )

    assert login_response.status_code == 200

    token = login_response.json()["access_token"]

    response = client.post(
        "/api/v1/career-recommendations/analyze",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json={
            "career_target_id": 999999,
            "job_description": (
                "We are looking for a Python backend developer "
                "with FastAPI, PostgreSQL, Docker, REST APIs, "
                "authentication, testing, and database design experience."
            ),
        },
    )

    assert response.status_code == 404


def test_career_fit_analyze_success(
    client,
    db_session,
    test_user,
):
    # Register
    register_response = client.post(
        "/api/v1/auth/register",
        json=test_user,
    )

    assert register_response.status_code == 201

    # Login
    login_response = client.post(
        "/api/v1/auth/login",
        data={
            "username": test_user["email"],
            "password": test_user["password"],
        },
    )

    assert login_response.status_code == 200

    token = login_response.json()["access_token"]

    # Get the real user
    user = db_session.query(User).filter_by(
        email=test_user["email"]
    ).one()

    # Create Career Target
    career_target = CareerTarget(
        user_id=user.id,
        title="Backend Engineering",
        target_role="Backend Engineer",
        target_level="Entry Level",
        description=(
            "Become a backend engineer specializing in "
            "Python APIs and scalable backend systems."
        ),
    )

    db_session.add(career_target)
    db_session.commit()
    db_session.refresh(career_target)

    job_description = (
        "We are looking for a Python Backend Engineer. "
        "The candidate should have experience with FastAPI, "
        "PostgreSQL, REST APIs, Docker, authentication, "
        "testing, and backend system design."
    )

    # Fake AI response so this test never calls OpenRouter.
    mock_result = {
        "company_name": "Test Company",
        "job_title": "Backend Engineer",
        "match_score": 82,
        "matched_skills": [
            "Python",
            "FastAPI",
            "PostgreSQL",
        ],
        "skill_gaps": [
            {
                "skill": "Docker",
                "importance": "high",
                "reason": "Required for containerized deployment.",
            }
        ],
        "strengths": [
            "Strong backend foundation",
        ],
        "career_insight": (
            "The candidate has a strong backend foundation "
            "but should improve deployment skills."
        ),
        "roadmap": [
            {
                "title": "Deployment Foundations",
                "objective": "Learn containerized backend deployment.",
                "skills": ["Docker"],
                "recommended_projects": [
                    "Dockerize a FastAPI application",
                ],
                "recommended_tasks": [
                    "Create a Dockerfile",
                ],
            }
        ],
        "next_action": (
            "Build and deploy one Dockerized FastAPI project."
        ),
    }

    with patch(
        "app.services.ai_career_fit_service.OpenRouterProvider.generate_json",
        return_value=mock_result,
    ):
        response = client.post(
            "/api/v1/career-recommendations/analyze",
            headers={
                "Authorization": f"Bearer {token}",
            },
            json={
                "career_target_id": career_target.id,
                "job_description": job_description,
            },
        )

    assert response.status_code == 201

    data = response.json()

    assert data["career_target_id"] == career_target.id
    assert data["company_name"] == "Test Company"
    assert data["job_title"] == "Backend Engineer"
    assert data["match_score"] == 82
    assert "Python" in data["matched_skills"]
    assert data["job_description"] == job_description


def test_career_fit_ai_failure_refunds_quota(
    client,
    db_session,
    test_user,
):
    from unittest.mock import patch

    from app.models.ai_usage import AIUsage
    from app.models.user_ai_usage import UserAIUsage
    from app.models.user import User
    from app.models.career_target import CareerTarget
    from datetime import date

    register_response = client.post(
        "/api/v1/auth/register",
        json=test_user,
    )

    assert register_response.status_code == 201

    login_response = client.post(
        "/api/v1/auth/login",
        data={
            "username": test_user["email"],
            "password": test_user["password"],
        },
    )

    assert login_response.status_code == 200

    token = login_response.json()["access_token"]

    user = db_session.query(User).filter_by(
        email=test_user["email"]
    ).one()

    career_target = CareerTarget(
        user_id=user.id,
        title="Backend Engineering",
        target_role="Backend Engineer",
        target_level="Entry Level",
        description="Become a backend engineer.",
    )

    db_session.add(career_target)
    db_session.commit()
    db_session.refresh(career_target)

    usage_date = date.today()

    # Get quota BEFORE the AI request.
    global_usage_before = (
        db_session.query(AIUsage)
        .filter_by(usage_date=usage_date)
        .one_or_none()
    )

    global_count_before = (
        global_usage_before.total_count
        if global_usage_before
        else 0
    )

    job_description = (
        "We are looking for a Python Backend Engineer "
        "with FastAPI, PostgreSQL, Docker, REST APIs, "
        "authentication, testing, and backend experience."
    )

    # Simulate an AI provider failure.
    with patch(
        "app.services.career_fit_service.analyze_career_fit",
        side_effect=AIProviderUnavailableError(
            "AI provider is temporarily unavailable"
        ),
    ):
        response = client.post(
            "/api/v1/career-recommendations/analyze",
            headers={
                "Authorization": f"Bearer {token}",
            },
            json={
                "career_target_id": career_target.id,
                "job_description": job_description,
            },
        )

    assert response.status_code == 503

    # User quota must be refunded.
    user_usage = (
        db_session.query(UserAIUsage)
        .filter_by(
            user_id=user.id,
            usage_date=usage_date,
        )
        .one()
    )

    assert user_usage.total_count == 0

    # Global quota must return to exactly what it was before.
    global_usage_after = (
        db_session.query(AIUsage)
        .filter_by(usage_date=usage_date)
        .one()
    )

    assert (
        global_usage_after.total_count
        == global_count_before
    )