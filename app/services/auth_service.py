from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.models.user import User
from app.repositories import user_repository
from app.schemas.auth import UserRegister

def register_user(db: Session, user_data: UserRegister) -> User:
    existing_user = user_repository.get_by_email(
        db,
        user_data.email,
    )

    if existing_user:
        raise ValueError("Email is already registered")

    hashed_password = hash_password(user_data.password)

    return user_repository.create(
    db,
    full_name=user_data.full_name,
    email=user_data.email,
    password_hash=hashed_password,
    timezone=user_data.timezone,
)

def authenticate_user(
    db: Session,
    email: str,
    password: str,
) -> User | None:

    user = user_repository.get_by_email(db, email)

    if user is None:
        return None

    if not user.is_active:
        return None

    if not verify_password(password, user.password_hash):
        return None

    return user

def login_user(
    db: Session,
    email: str,
    password: str,
) -> str | None:

    user = authenticate_user(
        db,
        email,
        password,
    )

    if user is None:
        return None

    user_repository.update_last_login(db, user)

    return create_access_token(user.id)