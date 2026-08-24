from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.skill_gap import SkillGap


def create(
    db: Session,
    user_id: int,
    data: dict,
) -> SkillGap:
    skill_gap = SkillGap(
        user_id=user_id,
        **data,
    )

    db.add(skill_gap)
    db.commit()
    db.refresh(skill_gap)

    return skill_gap


def get_by_id(
    db: Session,
    skill_gap_id: int,
    user_id: int,
) -> SkillGap | None:
    return db.scalar(
        select(SkillGap).where(
            SkillGap.id == skill_gap_id,
            SkillGap.user_id == user_id,
        )
    )


def get_all_by_user(
    db: Session,
    user_id: int,
) -> list[SkillGap]:
    statement = (
        select(SkillGap)
        .where(SkillGap.user_id == user_id)
        .order_by(SkillGap.created_at.desc())
    )

    return list(db.scalars(statement).all())


def update(
    db: Session,
    skill_gap: SkillGap,
    data: dict,
) -> SkillGap:
    for field, value in data.items():
        setattr(skill_gap, field, value)

    db.commit()
    db.refresh(skill_gap)

    return skill_gap


def delete(
    db: Session,
    skill_gap: SkillGap,
) -> None:
    db.delete(skill_gap)
    db.commit()