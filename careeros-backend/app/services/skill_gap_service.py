from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.skill_gap import SkillGap
from app.models.task import Task
from app.repositories import (
    skill_gap_repository,
    skill_gap_task_repository,
    skill_repository,
)
from app.schemas.skill_gap import (
    SkillGapCreate,
    SkillGapUpdate,
)

VALID_IMPORTANCE_VALUES = {
    "low",
    "medium",
    "high",
}


def create_skill_gap(
    db: Session,
    user_id: int,
    skill_gap_data: SkillGapCreate,
) -> SkillGap:
    data = skill_gap_data.model_dump()

    existing = skill_gap_repository.get_by_identity(
        db,
        user_id=user_id,
        career_target_id=data["career_target_id"],
        skill_id=data["skill_id"],
    )

    if existing is not None:
        return existing

    try:
        return skill_gap_repository.create(
            db,
            user_id,
            data,
        )

    except IntegrityError:
        db.rollback()

        existing = skill_gap_repository.get_by_identity(
            db,
            user_id=user_id,
            career_target_id=data["career_target_id"],
            skill_id=data["skill_id"],
        )

        if existing is not None:
            return existing

        raise


def synchronize_ai_skill_gaps(
    db: Session,
    *,
    user_id: int,
    career_target_id: int,
    ai_skill_gaps: list,
) -> dict[str, SkillGap]:
    synchronized_gaps: dict[str, SkillGap] = {}
    seen_skill_names: set[str] = set()

    for ai_skill_gap in ai_skill_gaps:
        skill_name = getattr(
            ai_skill_gap,
            "skill",
            None,
        )

        if not isinstance(skill_name, str):
            continue

        display_name = skill_name.strip()

        if not display_name:
            continue

        normalized_name = display_name.casefold()

        # Prevent duplicate AI output such as:
        # Docker / docker / DOCKER
        if normalized_name in seen_skill_names:
            continue

        seen_skill_names.add(normalized_name)

        skill = skill_repository.get_or_create_by_name(
            db,
            display_name,
        )

        existing = skill_gap_repository.get_by_identity(
            db,
            user_id=user_id,
            career_target_id=career_target_id,
            skill_id=skill.id,
        )

        # Important:
        # Existing SkillGap is preserved.
        #
        # AI must NOT overwrite:
        # - user progress status
        # - linked goal
        # - user notes
        # - manually managed importance
        if existing is not None:
            synchronized_gaps[normalized_name] = existing
            continue

        try:
            with db.begin_nested():
                skill_gap = skill_gap_repository.add(
                    db,
                    user_id=user_id,
                    career_target_id=career_target_id,
                    skill_id=skill.id,
                    importance=normalize_importance(
                        getattr(
                            ai_skill_gap,
                            "importance",
                            None,
                        ),
                    ),
                )

                db.flush()

        except IntegrityError:
            skill_gap = skill_gap_repository.get_by_identity(
                db,
                user_id=user_id,
                career_target_id=career_target_id,
                skill_id=skill.id,
            )

            if skill_gap is None:
                raise

        synchronized_gaps[normalized_name] = skill_gap

    return synchronized_gaps

def synchronize_skill_gap_status(
    db: Session,
    *,
    skill_gap: SkillGap,
) -> SkillGap:
    linked_tasks = (
        skill_gap_task_repository.get_all_by_skill_gap(
            db,
            skill_gap_id=skill_gap.id,
        )
    )

    if not linked_tasks:
        return skill_gap

    task_ids = [
        link.task_id
        for link in linked_tasks
    ]

    completed_tasks = 0

    for task_id in task_ids:
        task = db.get(
            __import__("app.models.task", fromlist=["Task"]).Task,
            task_id,
        )

        if task is not None and task.status == "completed":
            completed_tasks += 1

    if completed_tasks == 0:
        new_status = "missing"
    elif completed_tasks < len(task_ids):
        new_status = "developing"
    else:
        new_status = "acquired"

    if skill_gap.status != new_status:
        skill_gap.status = new_status

    return skill_gap

def normalize_importance(
    value: object,
) -> str:
    if not isinstance(value, str):
        return "medium"

    normalized_value = value.strip().lower()

    if normalized_value in VALID_IMPORTANCE_VALUES:
        return normalized_value

    return "medium"


def get_skill_gap(
    db: Session,
    skill_gap_id: int,
    user_id: int,
) -> SkillGap | None:
    return skill_gap_repository.get_by_id(
        db,
        skill_gap_id,
        user_id,
    )


def get_user_skill_gaps(
    db: Session,
    user_id: int,
) -> list[SkillGap]:
    return skill_gap_repository.get_all_by_user(
        db,
        user_id,
    )


def update_skill_gap(
    db: Session,
    skill_gap: SkillGap,
    skill_gap_data: SkillGapUpdate,
) -> SkillGap:
    data = skill_gap_data.model_dump(
        exclude_unset=True,
    )

    return skill_gap_repository.update(
        db,
        skill_gap,
        data,
    )


def delete_skill_gap(
    db: Session,
    skill_gap: SkillGap,
) -> None:
    skill_gap_repository.delete(
        db,
        skill_gap,
    )