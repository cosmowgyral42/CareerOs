from fastapi import APIRouter, HTTPException, status

from app.api.deps import CurrentUser, DatabaseSession
from app.schemas.user_skill import (
    UserSkillCreate,
    UserSkillResponse,
)
from app.services import user_skill_service


router = APIRouter(
    prefix="/skills",
    tags=["Skills"],
)


@router.get(
    "",
    response_model=list[UserSkillResponse],
)
def get_my_skills(
    db: DatabaseSession,
    current_user: CurrentUser,
):
    return user_skill_service.get_user_skills(
        db,
        current_user.id,
    )


@router.post(
    "",
    response_model=UserSkillResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_my_skill(
    skill_data: UserSkillCreate,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    return user_skill_service.add_skill_to_user(
        db,
        user_id=current_user.id,
        name=skill_data.name,
        category=skill_data.category,
        description=skill_data.description,
    )


@router.delete(
    "/{skill_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def remove_my_skill(
    skill_id: int,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    removed = user_skill_service.remove_skill_from_user(
        db,
        user_id=current_user.id,
        skill_id=skill_id,
    )

    if not removed:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found",
        )