from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.skill import Skill


def get_by_id(
    db: Session,
    skill_id: int,
) -> Skill | None:
    return db.scalar(
        select(Skill).where(
            Skill.id == skill_id,
        )
    )


def get_by_name(
    db: Session,
    name: str,
) -> Skill | None:
    return db.scalar(
        select(Skill)
        .where(Skill.name.ilike(name.strip()))
        .order_by(Skill.id.asc())
        .limit(1)
    )


def get_or_create_by_name(
    db: Session,
    name: str,
) -> Skill:
    normalized_name = name.strip()

    skill = get_by_name(
        db,
        normalized_name,
    )

    if skill is not None:
        return skill

    try:
        with db.begin_nested():
            skill = Skill(name=normalized_name)
            db.add(skill)
            db.flush()

    except IntegrityError:
        skill = get_by_name(
            db,
            normalized_name,
        )

        if skill is not None:
            return skill

        raise

    return skill
