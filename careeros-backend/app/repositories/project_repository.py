from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.project import Project


def create(db: Session, user_id: int, data: dict) -> Project:
    project = Project(user_id=user_id, **data)

    db.add(project)
    db.commit()
    db.refresh(project)

    return project


def get_by_id(
    db: Session,
    project_id: int,
    user_id: int,
) -> Project | None:
    return db.scalar(
        select(Project).where(
            Project.id == project_id,
            Project.user_id == user_id,
        )
    )


def get_all_by_user(
    db: Session,
    user_id: int,
) -> list[Project]:
    statement = (
        select(Project)
        .where(Project.user_id == user_id)
        .order_by(Project.created_at.desc())
    )

    return list(db.scalars(statement).all())


def update(
    db: Session,
    project: Project,
    data: dict,
) -> Project:
    for field, value in data.items():
        setattr(project, field, value)

    db.commit()
    db.refresh(project)

    return project


def delete(db: Session, project: Project) -> None:
    db.delete(project)
    db.commit()

def count_by_user_and_status(
    db: Session,
    user_id: int,
    status: str | None = None,
) -> int:
    from sqlalchemy import func

    statement = select(func.count(Project.id)).where(
        Project.user_id == user_id
    )

    if status is not None:
        statement = statement.where(Project.status == status)

    return db.scalar(statement) or 0