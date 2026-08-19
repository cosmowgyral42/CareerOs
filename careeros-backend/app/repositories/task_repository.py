from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.task import Task


def create(db: Session, user_id: int, data: dict) -> Task:
    task = Task(user_id=user_id, **data)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def get_by_id(db: Session, task_id: int, user_id: int) -> Task | None:
    return db.scalar(
        select(Task).where(
            Task.id == task_id,
            Task.user_id == user_id,
        )
    )


def get_all_by_user(db: Session, user_id: int) -> list[Task]:
    statement = (
        select(Task)
        .where(Task.user_id == user_id)
        .order_by(Task.created_at.desc())
    )
    return list(db.scalars(statement).all())


def update(db: Session, task: Task, data: dict) -> Task:
    for field, value in data.items():
        setattr(task, field, value)

    db.commit()
    db.refresh(task)
    return task


def delete(db: Session, task: Task) -> None:
    db.delete(task)
    db.commit()

def count_by_user_and_status(
    db: Session,
    user_id: int,
    status: str | None = None,
) -> int:
    from sqlalchemy import func

    statement = select(func.count(Task.id)).where(
        Task.user_id == user_id
    )

    if status is not None:
        statement = statement.where(Task.status == status)

    return db.scalar(statement) or 0