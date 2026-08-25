from sqlalchemy.orm import Session

from app.models.career_target_skill import (
    CareerTargetSkill,
)
from app.repositories import (
    career_target_skill_repository,
)
from app.schemas.career_target_skill import (
    CareerTargetSkillCreate,
    CareerTargetSkillUpdate,
)


def get_target_skills(
    db: Session,
    career_target_id: int,
) -> list[CareerTargetSkill]:
    return career_target_skill_repository.get_by_target(
        db,
        career_target_id,
    )


def add_target_skill(
    db: Session,
    career_target_id: int,
    skill_data: CareerTargetSkillCreate,
) -> CareerTargetSkill:
    existing = (
        career_target_skill_repository
        .get_by_target_and_skill(
            db,
            career_target_id,
            skill_data.skill_id,
        )
    )

    if existing is not None:
        return existing

    return career_target_skill_repository.create(
        db,
        career_target_id,
        skill_data.skill_id,
        skill_data.importance,
    )


def update_target_skill(
    db: Session,
    target_skill: CareerTargetSkill,
    skill_data: CareerTargetSkillUpdate,
) -> CareerTargetSkill:
    data = skill_data.model_dump(
        exclude_unset=True,
    )

    return career_target_skill_repository.update(
        db,
        target_skill,
        data,
    )


def delete_target_skill(
    db: Session,
    target_skill: CareerTargetSkill,
) -> None:
    career_target_skill_repository.delete(
        db,
        target_skill,
    )