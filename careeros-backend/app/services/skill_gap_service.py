from sqlalchemy.orm import Session

from app.models.skill_gap import SkillGap
from app.repositories import skill_gap_repository
from app.schemas.skill_gap import (
    SkillGapCreate,
    SkillGapUpdate,
)


def create_skill_gap(
    db: Session,
    user_id: int,
    skill_gap_data: SkillGapCreate,
) -> SkillGap:
    return skill_gap_repository.create(
        db,
        user_id,
        skill_gap_data.model_dump(),
    )


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