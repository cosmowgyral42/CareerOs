from sqlalchemy.orm import Session

from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate
from app.repositories import (
    project_repository,
    skill_gap_repository,
    skill_gap_project_repository,
)

def create_project(
    db: Session,
    user_id: int,
    project_data: ProjectCreate,
) -> Project:
    return project_repository.create(
        db,
        user_id,
        project_data.model_dump(),
    )


def get_project(
    db: Session,
    project_id: int,
    user_id: int,
) -> Project | None:
    return project_repository.get_by_id(
        db,
        project_id,
        user_id,
    )


def get_user_projects(
    db: Session,
    user_id: int,
) -> list[Project]:
    return project_repository.get_all_by_user(db, user_id)


def update_project(
    db: Session,
    project: Project,
    project_data: ProjectUpdate,
) -> Project:
    data = project_data.model_dump(exclude_unset=True)

    return project_repository.update(db, project, data)


def delete_project(
    db: Session,
    project: Project,
) -> None:
    project_repository.delete(db, project)

def create_project_for_skill_gap(
    db: Session,
    *,
    user_id: int,
    skill_gap_id: int,
    project_data: ProjectCreate,
) -> Project:
    skill_gap = skill_gap_repository.get_by_id(
        db,
        skill_gap_id,
        user_id,
    )

    if skill_gap is None:
        raise ValueError("Skill gap not found")

    try:
        project = project_repository.create_without_commit(
            db,
            user_id,
            project_data.model_dump(),
        )

        skill_gap_project_repository.create(
            db,
            skill_gap_id=skill_gap.id,
            project_id=project.id,
        )

        db.commit()
        db.refresh(project)

        return project

    except Exception:
        db.rollback()
        raise
