from sqlalchemy.orm import Session

from app.core.exceptions import EmailAlreadyExistsError
from app.core.logger import logger
from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.models.user import User
from app.repositories import user_repository
from app.schemas.auth import UserRegister
from app.services.activity_log_services import log_activity


def register_user(
    db: Session,
    user_data: UserRegister,
) -> User:
    logger.info("REGISTER FUNCTION REACHED")

    existing_user = user_repository.get_by_email(
        db,
        user_data.email,
    )

    if existing_user:
        raise EmailAlreadyExistsError()

    hashed_password = hash_password(
        user_data.password,
    )

    user = user_repository.create(
        db,
        full_name=user_data.full_name,
        email=user_data.email,
        password_hash=hashed_password,
        timezone=user_data.timezone,
    )

    print(f"USER REGISTERED SUCCESSFULLY: {user.id}")

    logger.info(
        "User registered successfully",
        extra={"user_id": user.id},
    )

    log_activity(
        db,
        user_id=user.id,
        action="register",
        entity_type="user",
        entity_id=user.id,
        payload={
            "email": user.email,
        },
    )

    return user


def authenticate_user(
    db: Session,
    email: str,
    password: str,
) -> User | None:
    user = user_repository.get_by_email(
        db,
        email,
    )

    if user is None:
        return None

    if not user.is_active:
        return None

    if not verify_password(
        password,
        user.password_hash,
    ):
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

    print(f"USER LOGIN SUCCESSFUL: {user.id}")

    logger.info(
        "User login successful",
        extra={"user_id": user.id},
    )

    user_repository.update_last_login(
        db,
        user,
    )

    log_activity(
        db,
        user_id=user.id,
        action="login",
        entity_type="user",
        entity_id=user.id,
        payload={
            "email": user.email,
        },
    )

    return create_access_token(
        user.id,
    )