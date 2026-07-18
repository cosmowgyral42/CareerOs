from sqlalchemy.orm import Session

from app.models.goal import Goal
from app.repositories import goal_repository
from app.schemas.goal import GoalCreate, GoalUpdate


def create_goal(
    db: Session,
    user_id: int,
    goal_data: GoalCreate,
) -> Goal:
    return goal_repository.create(
        db,
        user_id=user_id,
        title=goal_data.title,
        description=goal_data.description,
        target_date=goal_data.target_date,
    )


def get_goal(
    db: Session,
    goal_id: int,
    user_id: int,
) -> Goal | None:
    return goal_repository.get_by_id(db, goal_id, user_id)


def get_user_goals(
    db: Session,
    user_id: int,
) -> list[Goal]:
    return goal_repository.get_all_by_user(db, user_id)


def update_goal(
    db: Session,
    goal: Goal,
    goal_data: GoalUpdate,
) -> Goal:
    update_data = goal_data.model_dump(exclude_unset=True)

    return goal_repository.update(db, goal, update_data)


def delete_goal(db: Session, goal: Goal) -> None:
    goal_repository.delete(db, goal)