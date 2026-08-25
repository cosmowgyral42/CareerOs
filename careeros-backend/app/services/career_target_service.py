from sqlalchemy.orm import Session

from app.models.career_target import CareerTarget
from app.repositories import career_target_repository
from app.schemas.career_target import (
    CareerTargetCreate,
    CareerTargetUpdate,
)


def create_career_target(
    db: Session,
    user_id: int,
    target_data: CareerTargetCreate,
) -> CareerTarget:
    return career_target_repository.create(
        db,
        user_id,
        target_data.model_dump(),
    )


def get_career_target(
    db: Session,
    target_id: int,
    user_id: int,
) -> CareerTarget | None:
    return career_target_repository.get_by_id(
        db,
        target_id,
        user_id,
    )


def get_user_career_targets(
    db: Session,
    user_id: int,
) -> list[CareerTarget]:
    return career_target_repository.get_all_by_user(
        db,
        user_id,
    )


def update_career_target(
    db: Session,
    target: CareerTarget,
    target_data: CareerTargetUpdate,
) -> CareerTarget:
    data = target_data.model_dump(
        exclude_unset=True,
    )

    return career_target_repository.update(
        db,
        target,
        data,
    )


def delete_career_target(
    db: Session,
    target: CareerTarget,
) -> None:
    career_target_repository.delete(
        db,
        target,
    )