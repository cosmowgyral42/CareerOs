from fastapi import APIRouter, HTTPException, Response, status

from app.api.deps import CurrentUser, DatabaseSession
from app.schemas.user_skill import (
    UserSkillCreate,
    UserSkillResponse,
    UserSkillUpdate,
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
        level=skill_data.level,
    )


@router.patch(
    "/{skill_id}",
    response_model=UserSkillResponse,
)
def update_my_skill(
    skill_id: int,
    skill_data: UserSkillUpdate,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    skill = user_skill_service.update_skill_level(
        db,
        user_id=current_user.id,
        skill_id=skill_id,
        level=skill_data.level,
    )

    if skill is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found",
        )

    return skill


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

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )