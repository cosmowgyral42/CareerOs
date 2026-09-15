from datetime import date
from unittest.mock import patch
from uuid import uuid4

import pytest

from app.core.exceptions import AIProviderUnavailableError
from app.models.ai_usage import AIUsage
from app.models.career_target import CareerTarget
from app.models.goal import Goal
from app.models.job_match import JobMatch
from app.models.skill import Skill
from app.models.skill_gap import SkillGap
from app.models.user import User
from app.models.user_ai_usage import UserAIUsage
from app.schemas.career_fit import AICareerFitResult
from app.schemas.skill_gap import SkillGapCreate
from app.services import career_fit_service, skill_gap_service


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
    assert data["skill_gaps"][0]["skill"] == "Docker"
    assert isinstance(
        data["skill_gaps"][0]["skill_gap_id"],
        int,
    )
    assert data["job_description"] == job_description


def test_career_fit_ai_failure_refunds_quota(
    client,
    db_session,
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

    user_usage = (
        db_session.query(UserAIUsage)
        .filter_by(
            user_id=user.id,
            usage_date=usage_date,
        )
        .one()
    )

    assert user_usage.total_count == 0

    global_usage_after = (
        db_session.query(AIUsage)
        .filter_by(usage_date=usage_date)
        .one()
    )

    assert (
        global_usage_after.total_count
        == global_count_before
    )


def test_career_fit_synchronizes_actionable_skill_gaps(
    db_session,
):
    user = User(
        full_name="Career Fit Sync User",
        email=f"career-fit-sync-{uuid4()}@example.com",
        password_hash="test-password",
        timezone="Asia/Kolkata",
    )

    # Reuse Docker if another test already created it.
    existing_skill = (
        db_session.query(Skill)
        .filter_by(name="Docker")
        .one_or_none()
    )

    if existing_skill is None:
        existing_skill = Skill(name="Docker")
        db_session.add(existing_skill)

    db_session.add(user)
    db_session.commit()

    db_session.refresh(user)
    db_session.refresh(existing_skill)

    career_target = CareerTarget(
        user_id=user.id,
        title="Backend Engineering",
        target_role="Backend Engineer",
    )

    db_session.add(career_target)
    db_session.commit()
    db_session.refresh(career_target)

    first_result = _career_fit_result(
        [
            {
                "skill": " Docker ",
                "importance": " HIGH ",
                "reason": "Containerization is required.",
            },
            {
                "skill": "docker",
                "importance": "low",
                "reason": "Duplicate AI output.",
            },
            {
                "skill": "DOCKER",
                "importance": "medium",
                "reason": "Duplicate AI output.",
            },
            {
                "skill": "Kubernetes",
                "importance": "unexpected",
                "reason": "Orchestration is required.",
            },
        ]
    )

    with patch(
        "app.services.career_fit_service.analyze_career_fit",
        return_value=first_result,
    ):
        career_fit_service.analyze_career_fit_for_user(
            db_session,
            user_id=user.id,
            career_target=career_target,
            job_description=(
                "A sufficiently detailed backend job description."
            ),
            user_skills=[],
        )

    gaps = (
        db_session.query(SkillGap)
        .filter_by(
            user_id=user.id,
            career_target_id=career_target.id,
        )
        .all()
    )

    assert (
        db_session.query(JobMatch)
        .filter_by(user_id=user.id)
        .count()
        == 1
    )

    assert len(gaps) == 2

    docker_gap = next(
        gap
        for gap in gaps
        if gap.skill_id == existing_skill.id
    )

    kubernetes_skill = (
        db_session.query(Skill)
        .filter_by(name="Kubernetes")
        .one()
    )

    kubernetes_gap = next(
        gap
        for gap in gaps
        if gap.skill_id == kubernetes_skill.id
    )

    assert docker_gap.status == "missing"
    assert docker_gap.importance == "high"
    assert kubernetes_gap.importance == "medium"

    goal = Goal(
        user_id=user.id,
        title="Learn Docker",
    )

    db_session.add(goal)
    db_session.commit()
    db_session.refresh(goal)

    docker_gap.status = "learning"
    docker_gap.goal_id = goal.id
    docker_gap.notes = "User-managed note"
    docker_gap.importance = "low"

    db_session.commit()

    second_result = _career_fit_result(
        [
            {
                "skill": "docker",
                "importance": "high",
                "reason": "Updated AI rationale.",
            },
        ]
    )

    with patch(
        "app.services.career_fit_service.analyze_career_fit",
        return_value=second_result,
    ):
        career_fit_service.analyze_career_fit_for_user(
            db_session,
            user_id=user.id,
            career_target=career_target,
            job_description=(
                "A second sufficiently detailed job description."
            ),
            user_skills=[],
        )

    db_session.refresh(docker_gap)

    assert (
        db_session.query(JobMatch)
        .filter_by(user_id=user.id)
        .count()
        == 2
    )

    assert (
        db_session.query(SkillGap)
        .filter_by(
            user_id=user.id,
            career_target_id=career_target.id,
        )
        .count()
        == 2
    )

    assert docker_gap.status == "learning"
    assert docker_gap.goal_id == goal.id
    assert docker_gap.notes == "User-managed note"
    assert docker_gap.importance == "low"

    assert (
        db_session.query(SkillGap)
        .filter_by(id=kubernetes_gap.id)
        .one()
        is not None
    )


def test_career_fit_persistence_failure_rolls_back_and_refunds_quota(
    db_session,
):
    user = User(
        full_name="Career Fit Failure User",
        email=f"career-fit-failure-{uuid4()}@example.com",
        password_hash="test-password",
        timezone="Asia/Kolkata",
    )

    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    career_target = CareerTarget(
        user_id=user.id,
        title="Backend Engineering",
        target_role="Backend Engineer",
    )

    db_session.add(career_target)
    db_session.commit()
    db_session.refresh(career_target)

    with (
        patch(
            "app.services.career_fit_service.analyze_career_fit",
            return_value=_career_fit_result(
                [
                    {
                        "skill": "Docker",
                        "importance": "high",
                        "reason": "Required.",
                    },
                ]
            ),
        ),
        patch(
            "app.services.career_fit_service."
            "skill_gap_service.synchronize_ai_skill_gaps",
            side_effect=RuntimeError("Synchronization failed"),
        ),
    ):
        with pytest.raises(
            RuntimeError,
            match="Synchronization failed",
        ):
            career_fit_service.analyze_career_fit_for_user(
                db_session,
                user_id=user.id,
                career_target=career_target,
                job_description=(
                    "A sufficiently detailed backend job description."
                ),
                user_skills=[],
            )

    assert (
        db_session.query(JobMatch)
        .filter_by(user_id=user.id)
        .count()
        == 0
    )

    assert (
        db_session.query(SkillGap)
        .filter_by(user_id=user.id)
        .count()
        == 0
    )

    assert (
        db_session.query(UserAIUsage)
        .filter_by(
            user_id=user.id,
            usage_date=date.today(),
        )
        .one()
        .total_count
        == 0
    )


def test_manual_skill_gap_creation_is_idempotent(
    db_session,
):
    user = User(
        full_name="Manual Skill Gap User",
        email=f"manual-skill-gap-{uuid4()}@example.com",
        password_hash="test-password",
        timezone="Asia/Kolkata",
    )

    # Terraform is also globally unique, so reuse it if needed.
    skill = (
        db_session.query(Skill)
        .filter_by(name="Terraform")
        .one_or_none()
    )

    if skill is None:
        skill = Skill(name="Terraform")
        db_session.add(skill)

    db_session.add(user)
    db_session.commit()

    db_session.refresh(user)
    db_session.refresh(skill)

    career_target = CareerTarget(
        user_id=user.id,
        title="Platform Engineering",
        target_role="Platform Engineer",
    )

    db_session.add(career_target)
    db_session.commit()
    db_session.refresh(career_target)

    data = SkillGapCreate(
        career_target_id=career_target.id,
        skill_id=skill.id,
    )

    first = skill_gap_service.create_skill_gap(
        db_session,
        user.id,
        data,
    )

    second = skill_gap_service.create_skill_gap(
        db_session,
        user.id,
        data,
    )

    assert first.id == second.id

    assert (
        db_session.query(SkillGap)
        .filter_by(
            user_id=user.id,
            career_target_id=career_target.id,
            skill_id=skill.id,
        )
        .count()
        == 1
    )


def _career_fit_result(skill_gaps):
    return AICareerFitResult.model_validate(
        {
            "company_name": "Test Company",
            "job_title": "Backend Engineer",
            "match_score": 80,
            "matched_skills": ["Python"],
            "skill_gaps": skill_gaps,
            "strengths": ["Backend fundamentals"],
            "career_insight": (
                "Improve deployment skills."
            ),
            "roadmap": [],
            "next_action": (
                "Build a deployment project."
            ),
        }
    )