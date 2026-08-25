from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.career_target import CareerTarget


def create(
    db: Session,
    user_id: int,
    data: dict,
) -> CareerTarget:
    target = CareerTarget(
        user_id=user_id,
        **data,
    )

    db.add(target)
    db.commit()
    db.refresh(target)

    return target


def get_by_id(
    db: Session,
    target_id: int,
    user_id: int,
) -> CareerTarget | None:
    statement = select(CareerTarget).where(
        CareerTarget.id == target_id,
        CareerTarget.user_id == user_id,
    )

    return db.scalar(statement)


def get_all_by_user(
    db: Session,
    user_id: int,
) -> list[CareerTarget]:
    statement = (
        select(CareerTarget)
        .where(CareerTarget.user_id == user_id)
        .order_by(CareerTarget.created_at.desc())
    )

    return list(db.scalars(statement).all())


def update(
    db: Session,
    target: CareerTarget,
    data: dict,
) -> CareerTarget:
    for field, value in data.items():
        setattr(target, field, value)

    db.commit()
    db.refresh(target)

    return target


def delete(
    db: Session,
    target: CareerTarget,
) -> None:
    db.delete(target)
    db.commit()