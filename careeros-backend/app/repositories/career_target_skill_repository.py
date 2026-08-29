from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.career_target_skill import (
    CareerTargetSkill,
)
from sqlalchemy.exc import IntegrityError

def create(
    db: Session,
    career_target_id: int,
    skill_id: int,
    importance: str,
) -> CareerTargetSkill:
    target_skill = CareerTargetSkill(
        career_target_id=career_target_id,
        skill_id=skill_id,
        importance=importance,
    )

    try:
        db.add(target_skill)
        db.commit()
        db.refresh(target_skill)

        return target_skill

    except IntegrityError:
        db.rollback()
        raise

def get_by_id(
    db: Session,
    target_skill_id: int,
    career_target_id: int,
) -> CareerTargetSkill | None:
    statement = select(
        CareerTargetSkill
    ).where(
        CareerTargetSkill.id
        == target_skill_id,
        CareerTargetSkill.career_target_id
        == career_target_id,
    )

    return db.scalar(statement)


def get_by_target(
    db: Session,
    career_target_id: int,
) -> list[CareerTargetSkill]:
    statement = (
        select(CareerTargetSkill)
        .where(
            CareerTargetSkill.career_target_id
            == career_target_id
        )
        .order_by(
            CareerTargetSkill.created_at.asc()
        )
    )

    return list(
        db.scalars(statement).all()
    )


def get_by_target_and_skill(
    db: Session,
    career_target_id: int,
    skill_id: int,
) -> CareerTargetSkill | None:
    statement = select(
        CareerTargetSkill
    ).where(
        CareerTargetSkill.career_target_id
        == career_target_id,
        CareerTargetSkill.skill_id
        == skill_id,
    )

    return db.scalar(statement)


def update(
    db: Session,
    target_skill: CareerTargetSkill,
    data: dict,
) -> CareerTargetSkill:
    for field, value in data.items():
        setattr(
            target_skill,
            field,
            value,
        )

    db.commit()
    db.refresh(target_skill)

    return target_skill


def delete(
    db: Session,
    target_skill: CareerTargetSkill,
) -> None:
    db.delete(target_skill)
    db.commit()