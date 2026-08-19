from sqlalchemy.orm import Session

from app.models.project import Project
from app.repositories import project_repository
from app.schemas.project import ProjectCreate, ProjectUpdate


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