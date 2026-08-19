from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.goal import Goal


def create(
    db: Session,
    *,
    user_id: int,
    title: str,
    description: str | None,
    target_date,
) -> Goal:
    goal = Goal(
        user_id=user_id,
        title=title,
        description=description,
        target_date=target_date,
    )

    db.add(goal)
    db.commit()
    db.refresh(goal)

    return goal


def get_by_id(
    db: Session,
    goal_id: int,
    user_id: int,
) -> Goal | None:
    statement = select(Goal).where(
        Goal.id == goal_id,
        Goal.user_id == user_id,
    )

    return db.scalar(statement)


def get_all_by_user(
    db: Session,
    user_id: int,
) -> list[Goal]:
    statement = (
        select(Goal)
        .where(Goal.user_id == user_id)
        .order_by(Goal.created_at.desc())
    )

    return list(db.scalars(statement).all())


def update(
    db: Session,
    goal: Goal,
    update_data: dict,
) -> Goal:
    for field, value in update_data.items():
        setattr(goal, field, value)

    db.commit()
    db.refresh(goal)

    return goal


def delete(db: Session, goal: Goal) -> None:
    db.delete(goal)
    db.commit()

def count_by_user_and_status(
    db: Session,
    user_id: int,
    status: str | None = None,
) -> int:
    from sqlalchemy import func

    statement = select(func.count(Goal.id)).where(
        Goal.user_id == user_id
    )

    if status is not None:
        statement = statement.where(Goal.status == status)

    return db.scalar(statement) or 0    