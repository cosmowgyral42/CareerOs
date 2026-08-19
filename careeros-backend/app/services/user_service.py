from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories import user_repository
from app.schemas.user import UserUpdate


def get_user_by_id(
    db: Session,
    user_id: int,
) -> User | None:
    return user_repository.get_by_id(db, user_id)


def update_user(
    db: Session,
    user: User,
    update_data: UserUpdate,
) -> User:

    data = update_data.model_dump(exclude_unset=True)

    return user_repository.update(
        db,
        user,
        data,
    )