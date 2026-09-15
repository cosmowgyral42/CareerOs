from sqlalchemy.orm import Session

from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate
from app.repositories import (
    goal_repository,
    skill_gap_repository,
    skill_gap_task_repository,
    task_repository,
)
from app.services import skill_gap_service
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
        goal = goal_repository.get_by_id(
            db,
            data["goal_id"],
            user_id,
        )

        if goal is None:
            raise ValueError("Goal not found")

    status_changed = (
        "status" in data
        and data["status"] != task.status
    )

    try:
        updated_task = task_repository.update_without_commit(
            db,
            task,
            data,
        )

        if status_changed:
            linked_skill_gaps = (
                skill_gap_task_repository.get_all_by_task(
                    db,
                    task_id=updated_task.id,
                )
            )

            for link in linked_skill_gaps:
                skill_gap = skill_gap_repository.get_by_id(
                    db,
                    link.skill_gap_id,
                    user_id,
                )

                if skill_gap is not None:
                    skill_gap_service.synchronize_skill_gap_status(
                        db,
                        skill_gap=skill_gap,
                    )

        db.commit()
        db.refresh(updated_task)

        return updated_task

    except Exception:
        db.rollback()
        raise
def delete_task(db: Session, task: Task) -> None:
    task_repository.delete(db, task)

def create_task_for_skill_gap(
    db: Session,
    *,
    user_id: int,
    skill_gap_id: int,
    task_data: TaskCreate,
) -> Task:
    skill_gap = skill_gap_repository.get_by_id(
        db,
        skill_gap_id,
        user_id,
    )

    if skill_gap is None:
        raise ValueError("Skill gap not found")

    if task_data.goal_id is not None:
        goal = goal_repository.get_by_id(
            db,
            task_data.goal_id,
            user_id,
        )

        if goal is None:
            raise ValueError("Goal not found")

    try:
        task = task_repository.create_without_commit(
            db,
            user_id,
            task_data.model_dump(),
        )

        skill_gap_task_repository.create(
            db,
            skill_gap_id=skill_gap.id,
            task_id=task.id,
        )

        db.commit()
        db.refresh(task)

        return task

    except Exception:
        db.rollback()
        raise
