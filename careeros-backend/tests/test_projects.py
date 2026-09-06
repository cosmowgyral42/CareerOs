from uuid import uuid4

from app.models.career_target import CareerTarget
from app.models.project import Project
from app.models.skill import Skill
from app.models.skill_gap import SkillGap
from app.models.skill_gap_project import SkillGapProject
from app.models.user import User
def test_create_project_requires_auth(client):
    response = client.post(
        "/api/v1/projects/",
        json={
            "name": "CareerOS",
            "description": "AI-powered career platform",
        },
    )

    assert response.status_code == 401


def test_get_projects_requires_auth(client):
    response = client.get(
        "/api/v1/projects/",
    )

    assert response.status_code == 401

def test_create_project_from_skill_gap_creates_linked_project(
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
        db_session.query(User)
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
        f"/api/v1/projects/from-skill-gap/{skill_gap.id}",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json={
            "title": "Dockerized FastAPI Application",
            "description": "Build and deploy a containerized FastAPI application.",
            "tech_stack": "FastAPI, Docker, PostgreSQL",
        },
    )

    assert response.status_code == 201

    data = response.json()

    assert data["title"] == (
        "Dockerized FastAPI Application"
    )
    assert data["description"] == (
        "Build and deploy a containerized FastAPI application."
    )
    assert data["tech_stack"] == (
        "FastAPI, Docker, PostgreSQL"
    )
    assert data["user_id"] == actual_user.id

    project_id = data["id"]

    project = (
        db_session.query(Project)
        .filter_by(id=project_id)
        .one_or_none()
    )

    assert project is not None

    link = (
        db_session.query(SkillGapProject)
        .filter_by(
            skill_gap_id=skill_gap.id,
            project_id=project_id,
        )
        .one_or_none()
    )

    assert link is not None    