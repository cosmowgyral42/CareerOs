from uuid import uuid4

from app.models.career_target import CareerTarget
from app.models.job_match import JobMatch
from app.models.skill import Skill
from app.models.skill_gap import SkillGap
from app.models.user import User


def test_dashboard_requires_auth(client):
    response = client.get(
        "/api/v1/dashboard",
    )

    assert response.status_code == 401


def test_dashboard_includes_career_data(
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

    token = login_response.json()[
        "access_token"
    ]

    user = (
        db_session.query(User)
        .filter_by(
            email=test_user["email"]
        )
        .one()
    )

    career_target = CareerTarget(
        user_id=user.id,
        title="Backend Engineering",
        target_role="Backend Engineer",
        target_level="Entry Level",
        is_active=True,
    )

    skill = Skill(
        name=f"Docker-{uuid4()}",
    )

    db_session.add_all([
        career_target,
        skill,
    ])
    db_session.commit()

    db_session.refresh(career_target)
    db_session.refresh(skill)

    missing_gap = SkillGap(
        user_id=user.id,
        career_target_id=career_target.id,
        skill_id=skill.id,
        status="missing",
        importance="high",
    )

    db_session.add(missing_gap)

    job_match = JobMatch(
        user_id=user.id,
        career_target_id=career_target.id,
        company_name="Test Company",
        job_title="Backend Engineer",
        job_description=(
            "A sufficiently detailed "
            "backend engineering role."
        ),
        match_score=82.0,
    )

    db_session.add(job_match)
    db_session.commit()

    response = client.get(
        "/api/v1/dashboard",
        headers={
            "Authorization": (
                f"Bearer {token}"
            ),
        },
    )

    assert response.status_code == 200

    data = response.json()
    stats = data["stats"]

    assert stats[
        "total_career_targets"
    ] == 1

    assert stats[
        "active_career_targets"
    ] == 1

    assert stats[
        "total_skill_gaps"
    ] == 1

    assert stats[
        "missing_skill_gaps"
    ] == 1

    assert stats[
        "total_job_matches"
    ] == 1

    assert stats[
        "average_match_score"
    ] == 82.0

    assert stats[
        "latest_match_score"
    ] == 82.0