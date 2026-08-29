from fastapi import (
    APIRouter,
    HTTPException,
    Response,
    status,
)

from app.api.deps import (
    CurrentUser,
    DatabaseSession,
)
from app.schemas.career_target import (
    CareerTargetCreate,
    CareerTargetResponse,
    CareerTargetUpdate,
)
from app.schemas.career_target_skill import (
    CareerTargetSkillCreate,
    CareerTargetSkillResponse,
    CareerTargetSkillUpdate,
)
from app.services import (
    career_target_service,
    career_target_skill_service,
)


router = APIRouter(
    prefix="/career-targets",
    tags=["Career Targets"],
)


@router.post(
    "",
    response_model=CareerTargetResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_career_target(
    target_data: CareerTargetCreate,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    return career_target_service.create_career_target(
        db,
        current_user.id,
        target_data,
    )


@router.get(
    "",
    response_model=list[CareerTargetResponse],
)
def get_career_targets(
    db: DatabaseSession,
    current_user: CurrentUser,
):
    return career_target_service.get_user_career_targets(
        db,
        current_user.id,
    )


@router.get(
    "/{target_id}",
    response_model=CareerTargetResponse,
)
def get_career_target(
    target_id: int,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    target = career_target_service.get_career_target(
        db,
        target_id,
        current_user.id,
    )

    if target is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Career target not found",
        )

    return target


@router.patch(
    "/{target_id}",
    response_model=CareerTargetResponse,
)
def update_career_target(
    target_id: int,
    target_data: CareerTargetUpdate,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    target = career_target_service.get_career_target(
        db,
        target_id,
        current_user.id,
    )

    if target is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Career target not found",
        )

    return career_target_service.update_career_target(
        db,
        target,
        target_data,
    )


@router.delete(
    "/{target_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_career_target(
    target_id: int,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    target = career_target_service.get_career_target(
        db,
        target_id,
        current_user.id,
    )

    if target is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Career target not found",
        )

    career_target_service.delete_career_target(
        db,
        target,
    )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )


@router.get(
    "/{target_id}/skills",
    response_model=list[CareerTargetSkillResponse],
)
def get_target_skills(
    target_id: int,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    target = career_target_service.get_career_target(
        db,
        target_id,
        current_user.id,
    )

    if target is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Career target not found",
        )

    return career_target_skill_service.get_target_skills(
        db,
        target_id,
    )


@router.post(
    "/{target_id}/skills",
    response_model=CareerTargetSkillResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_target_skill(
    target_id: int,
    skill_data: CareerTargetSkillCreate,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    target = career_target_service.get_career_target(
        db,
        target_id,
        current_user.id,
    )

    if target is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Career target not found",
        )

    return career_target_skill_service.add_target_skill(
        db,
        target_id,
        skill_data,
    )


@router.patch(
    "/{target_id}/skills/{target_skill_id}",
    response_model=CareerTargetSkillResponse,
)
def update_target_skill(
    target_id: int,
    target_skill_id: int,
    skill_data: CareerTargetSkillUpdate,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    target = career_target_service.get_career_target(
        db,
        target_id,
        current_user.id,
    )

    if target is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Career target not found",
        )

    target_skill = (
        career_target_skill_service.get_target_skill(
            db,
            target_id=target_id,
            target_skill_id=target_skill_id,
        )
    )

    if target_skill is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Target skill not found",
        )

    return career_target_skill_service.update_target_skill(
        db,
        target_skill,
        skill_data,
    )


@router.delete(
    "/{target_id}/skills/{target_skill_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_target_skill(
    target_id: int,
    target_skill_id: int,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    target = career_target_service.get_career_target(
        db,
        target_id,
        current_user.id,
    )

    if target is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Career target not found",
        )

    target_skill = (
        career_target_skill_service.get_target_skill(
            db,
            target_id=target_id,
            target_skill_id=target_skill_id,
        )
    )

    if target_skill is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Target skill not found",
        )

    career_target_skill_service.delete_target_skill(
        db,
        target_skill,
    )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )