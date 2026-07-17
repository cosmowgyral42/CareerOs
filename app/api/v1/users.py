from fastapi import APIRouter

from app.api.deps import CurrentUser
from app.schemas.user import UserResponse


router = APIRouter(prefix="/users", tags=["Users"])


@router.get(
    "/me",
    response_model=UserResponse,
)
def get_my_profile(
    current_user: CurrentUser,
) -> UserResponse:
    return current_user