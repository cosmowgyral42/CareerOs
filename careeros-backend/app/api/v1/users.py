from fastapi import APIRouter

from app.api.deps import (
    CurrentUser,
    DatabaseSession,
)
from app.schemas.user import (
    UserResponse,
    UserUpdate,
)
from app.services.user_service import update_user


router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.get(
    "/me",
    response_model=UserResponse,
)
def get_my_profile(
    current_user: CurrentUser,
) -> UserResponse:
    return current_user


@router.patch(
    "/me",
    response_model=UserResponse,
)
def update_my_profile(
    user_data: UserUpdate,
    db: DatabaseSession,
    current_user: CurrentUser,
) -> UserResponse:
    return update_user(
        db,
        current_user,
        user_data,
    )