from fastapi import APIRouter, HTTPException, Response, status

from app.api.deps import CurrentUser, DatabaseSession
from app.schemas.skill_gap import (
    SkillGapCreate,
    SkillGapResponse,
    SkillGapUpdate,
)
from app.services import skill_gap_service


router = APIRouter(
    prefix="/skill-gaps",
    tags=["Skill Gaps"],
)


@router.post(
    "",
    response_model=SkillGapResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_skill_gap(
    skill_gap_data: SkillGapCreate,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    return skill_gap_service.create_skill_gap(
        db,
        current_user.id,
        skill_gap_data,
    )


@router.get(
    "",
    response_model=list[SkillGapResponse],
)
def get_skill_gaps(
    db: DatabaseSession,
    current_user: CurrentUser,
):
    return skill_gap_service.get_user_skill_gaps(
        db,
        current_user.id,
    )


@router.get(
    "/{skill_gap_id}",
    response_model=SkillGapResponse,
)
def get_skill_gap(
    skill_gap_id: int,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    skill_gap = skill_gap_service.get_skill_gap(
        db,
        skill_gap_id,
        current_user.id,
    )

    if skill_gap is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill gap not found",
        )

    return skill_gap


@router.patch(
    "/{skill_gap_id}",
    response_model=SkillGapResponse,
)
def update_skill_gap(
    skill_gap_id: int,
    skill_gap_data: SkillGapUpdate,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    skill_gap = skill_gap_service.get_skill_gap(
        db,
        skill_gap_id,
        current_user.id,
    )

    if skill_gap is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill gap not found",
        )

    return skill_gap_service.update_skill_gap(
        db,
        skill_gap,
        skill_gap_data,
    )


@router.delete(
    "/{skill_gap_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_skill_gap(
    skill_gap_id: int,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    skill_gap = skill_gap_service.get_skill_gap(
        db,
        skill_gap_id,
        current_user.id,
    )

    if skill_gap is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill gap not found",
        )

    skill_gap_service.delete_skill_gap(
        db,
        skill_gap,
    )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )