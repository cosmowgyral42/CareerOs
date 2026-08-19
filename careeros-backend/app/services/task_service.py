from sqlalchemy.orm import Session

from app.models.task import Task
from app.repositories import goal_repository, task_repository
from app.schemas.task import TaskCreate, TaskUpdate


def create_task(db: Session, user_id: int, task_data: TaskCreate) -> Task:
    if task_data.goal_id is not None:
        goal = goal_repository.get_by_id(db, task_data.goal_id, user_id)

        if goal is None:
            raise ValueError("Goal not found")

    return task_repository.create(
        db,
        user_id,
        task_data.model_dump(),
    )


def get_task(db: Session, task_id: int, user_id: int) -> Task | None:
    return task_repository.get_by_id(db, task_id, user_id)


def get_user_tasks(db: Session, user_id: int) -> list[Task]:
    return task_repository.get_all_by_user(db, user_id)


def update_task(
    db: Session,
    task: Task,
    user_id: int,
    task_data: TaskUpdate,
) -> Task:
    data = task_data.model_dump(exclude_unset=True)

    if "goal_id" in data and data["goal_id"] is not None:
        goal = goal_repository.get_by_id(db, data["goal_id"], user_id)

        if goal is None:
            raise ValueError("Goal not found")

    return task_repository.update(db, task, data)


def delete_task(db: Session, task: Task) -> None:
    task_repository.delete(db, task)