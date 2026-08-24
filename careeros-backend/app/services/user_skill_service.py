from sqlalchemy.orm import Session

from app.repositories import user_skill_repository


def get_user_skill_names(
    db: Session,
    user_id: int,
) -> list[str]:
    skills = user_skill_repository.get_user_skills(
        db,
        user_id,
    )

    return [skill.name for skill in skills]


def get_user_skills(
    db: Session,
    user_id: int,
):
    return user_skill_repository.get_user_skills(
        db,
        user_id,
    )


def add_skill_to_user(
    db: Session,
    *,
    user_id: int,
    name: str,
    category: str | None = None,
    description: str | None = None,
    level: str = "beginner",
):
    skill = user_skill_repository.get_skill_by_name(
        db,
        name,
    )

    if skill is None:
        skill = user_skill_repository.create_skill(
            db,
            name=name,
            category=category,
            description=description,
        )

    existing = user_skill_repository.get_user_skill(
        db,
        user_id,
        skill.id,
    )

    if existing is not None:
        return skill

    user_skill_repository.add_user_skill(
        db,
        user_id,
        skill.id,
        level,
    )

    return skill


def update_skill_level(
    db: Session,
    *,
    user_id: int,
    skill_id: int,
    level: str,
):
    user_skill = user_skill_repository.get_user_skill(
        db,
        user_id,
        skill_id,
    )

    if user_skill is None:
        return None

    user_skill_repository.update_user_skill(
        db,
        user_skill,
        level,
    )

    return user_skill

    return user_skill_repository.get_skill_by_name(
        db,
        user_skill_skill_name(db, user_skill.skill_id),
    )


def user_skill_skill_name(
    db: Session,
    skill_id: int,
) -> str:
    from app.models.skill import Skill

    skill = db.get(Skill, skill_id)

    if skill is None:
        return ""

    return skill.name


def remove_skill_from_user(
    db: Session,
    *,
    user_id: int,
    skill_id: int,
) -> bool:
    return user_skill_repository.remove_user_skill(
        db,
        user_id,
        skill_id,
    )