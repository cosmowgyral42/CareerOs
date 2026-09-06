from uuid import uuid4

from app.models.career_target import CareerTarget
from app.models.skill import Skill
from app.models.skill_gap import SkillGap
from app.models.skill_gap_task import SkillGapTask


def test_create_task_requires_auth(client):
    response = client.post(
        "/api/v1/tasks/",
        json={
            "title": "Study FastAPI",
            "description": "Review FastAPI fundamentals",
        },
    )

    assert response.status_code == 401


def test_get_tasks_requires_auth(client):
    response = client.get(
        "/api/v1/tasks/",
    )

    assert response.status_code == 401


def test_create_task_from_skill_gap_creates_linked_task(
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

    user = (
        db_session.query(SkillGap)
        .filter_by(user_id=999999)
        .first()
    )

    assert user is None

    actual_user = (
        db_session.query(
            __import__("app.models.user", fromlist=["User"]).User
        )
        .filter_by(email=test_user["email"])
        .one()
    )

    skill = Skill(
        name=f"Testing Skill {uuid4()}",
    )

    db_session.add(skill)
    db_session.commit()
    db_session.refresh(skill)

    career_target = CareerTarget(
        user_id=actual_user.id,
        title="Backend Engineering",
        target_role="Backend Engineer",
    )

    db_session.add(career_target)
    db_session.commit()
    db_session.refresh(career_target)

    skill_gap = SkillGap(
        user_id=actual_user.id,
        career_target_id=career_target.id,
        skill_id=skill.id,
        importance="high",
        status="missing",
    )

    db_session.add(skill_gap)
    db_session.commit()
    db_session.refresh(skill_gap)

    response = client.post(
        f"/api/v1/tasks/from-skill-gap/{skill_gap.id}",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json={
            "title": "Learn Testing",
            "description": "Practice automated backend testing.",
            "priority": "high",
        },
    )

    assert response.status_code == 201

    data = response.json()

    assert data["title"] == "Learn Testing"
    assert data["description"] == (
        "Practice automated backend testing."
    )
    assert data["priority"] == "high"
    assert data["user_id"] == actual_user.id

    task_id = data["id"]

    link = (
        db_session.query(SkillGapTask)
        .filter_by(
            skill_gap_id=skill_gap.id,
            task_id=task_id,
        )
        .one_or_none()
    )

    assert link is not None
def test_completing_linked_task_updates_skill_gap_status(
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

    actual_user = (
        db_session.query(
            __import__(
                "app.models.user",
                fromlist=["User"],
            ).User
        )
        .filter_by(email=test_user["email"])
        .one()
    )

    skill = Skill(
        name=f"Progress Skill {uuid4()}",
    )

    db_session.add(skill)
    db_session.commit()
    db_session.refresh(skill)

    career_target = CareerTarget(
        user_id=actual_user.id,
        title="Backend Engineering",
        target_role="Backend Engineer",
    )

    db_session.add(career_target)
    db_session.commit()
    db_session.refresh(career_target)

    skill_gap = SkillGap(
        user_id=actual_user.id,
        career_target_id=career_target.id,
        skill_id=skill.id,
        importance="high",
        status="missing",
    )

    db_session.add(skill_gap)
    db_session.commit()
    db_session.refresh(skill_gap)

    create_response = client.post(
        f"/api/v1/tasks/from-skill-gap/{skill_gap.id}",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json={
            "title": "Practice Progress Skill",
            "description": "Complete the skill learning task.",
            "priority": "high",
        },
    )

    assert create_response.status_code == 201

    task_id = create_response.json()["id"]

    assert skill_gap.status == "missing"

    update_response = client.patch(
        f"/api/v1/tasks/{task_id}",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json={
            "status": "completed",
        },
    )

    assert update_response.status_code == 200

    db_session.expire_all()

    updated_skill_gap = (
        db_session.query(SkillGap)
        .filter_by(id=skill_gap.id)
        .one()
    )

    assert updated_skill_gap.status == "acquired"    