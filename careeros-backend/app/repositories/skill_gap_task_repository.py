from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.skill_gap_task import SkillGapTask


def get_by_identity(
    db: Session,
    *,
    skill_gap_id: int,
    task_id: int,
) -> SkillGapTask | None:
    return db.scalar(
        select(SkillGapTask).where(
            SkillGapTask.skill_gap_id == skill_gap_id,
            SkillGapTask.task_id == task_id,
        )
    )


def create(
    db: Session,
    *,
    skill_gap_id: int,
    task_id: int,
) -> SkillGapTask:
    skill_gap_task = SkillGapTask(
        skill_gap_id=skill_gap_id,
        task_id=task_id,
    )

    db.add(skill_gap_task)
    db.flush()

    return skill_gap_task


def get_all_by_skill_gap(
    db: Session,
    *,
    skill_gap_id: int,
) -> list[SkillGapTask]:
    statement = (
        select(SkillGapTask)
        .where(SkillGapTask.skill_gap_id == skill_gap_id)
        .order_by(SkillGapTask.created_at.desc())
    )

    return list(db.scalars(statement).all())


def get_all_by_task(
    db: Session,
    *,
    task_id: int,
) -> list[SkillGapTask]:
    statement = (
        select(SkillGapTask)
        .where(SkillGapTask.task_id == task_id)
        .order_by(SkillGapTask.created_at.desc())
    )

    return list(db.scalars(statement).all())


def delete(
    db: Session,
    skill_gap_task: SkillGapTask,
) -> None:
    db.delete(skill_gap_task)
    db.flush()