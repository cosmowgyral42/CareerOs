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

    if user_skill_repository.user_has_skill(
        db,
        user_id,
        skill.id,
    ):
        return skill

    user_skill_repository.add_user_skill(
        db,
        user_id,
        skill.id,
    )

    return skill


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