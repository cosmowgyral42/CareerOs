from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.skill import Skill
from app.models.user_skill import UserSkill


def get_user_skills(
    db: Session,
    user_id: int,
):
    statement = (
        select(
            UserSkill.id,
            Skill.id.label("skill_id"),
            Skill.name,
            Skill.category,
            Skill.description,
            UserSkill.level,
        )
        .join(
            Skill,
            UserSkill.skill_id == Skill.id,
        )
        .where(
            UserSkill.user_id == user_id,
        )
        .order_by(
            Skill.name.asc(),
        )
    )

    return list(db.execute(statement).mappings().all())


def get_skill_by_name(
    db: Session,
    name: str,
) -> Skill | None:
    return db.scalar(
        select(Skill).where(
            Skill.name.ilike(name.strip()),
        )
    )


def get_user_skill(
    db: Session,
    user_id: int,
    skill_id: int,
) -> UserSkill | None:
    statement = select(UserSkill).where(
        UserSkill.user_id == user_id,
        UserSkill.skill_id == skill_id,
    )

    return db.scalar(statement)


def user_has_skill(
    db: Session,
    user_id: int,
    skill_id: int,
) -> bool:
    return (
        get_user_skill(
            db,
            user_id,
            skill_id,
        )
        is not None
    )


def create_skill(
    db: Session,
    name: str,
    category: str | None = None,
    description: str | None = None,
) -> Skill:
    skill = Skill(
        name=name.strip(),
        category=category,
        description=description,
    )

    db.add(skill)
    db.commit()
    db.refresh(skill)

    return skill


def add_user_skill(
    db: Session,
    user_id: int,
    skill_id: int,
    level: str = "beginner",
) -> UserSkill:
    user_skill = UserSkill(
        user_id=user_id,
        skill_id=skill_id,
        level=level,
    )

    db.add(user_skill)
    db.commit()
    db.refresh(user_skill)

    return user_skill


def update_user_skill_level(
    db: Session,
    user_skill: UserSkill,
    level: str,
) -> UserSkill:
    user_skill.level = level

    db.commit()
    db.refresh(user_skill)

    return user_skill


def remove_user_skill(
    db: Session,
    user_id: int,
    skill_id: int,
) -> bool:
    user_skill = get_user_skill(
        db,
        user_id,
        skill_id,
    )

    if user_skill is None:
        return False

    db.delete(user_skill)
    db.commit()

    return True