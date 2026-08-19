import json

from fastapi import APIRouter, HTTPException, status

from app.api.deps import CurrentUser, DatabaseSession
from app.models.career_target import CareerTarget
from app.schemas.career_fit import (
    CareerFitAnalyzeRequest,
    CareerFitResponse,
)
from app.schemas.career_recommendation import (
    CareerRecommendationCreate,
    CareerRecommendationResponse,
)
from app.services import career_fit_service
from app.services import career_recommendation_service
from app.services.user_skill_service import get_user_skill_names


router = APIRouter(
    prefix="/career-recommendations",
    tags=["Career Recommendations"],
)


@router.post(
    "/analyze",
    response_model=CareerFitResponse,
    status_code=status.HTTP_201_CREATED,
)
def analyze_career_fit(
    request_data: CareerFitAnalyzeRequest,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    career_target = db.get(
        CareerTarget,
        request_data.career_target_id,
    )

    if career_target is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Career target not found",
        )

    if career_target.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Career target not found",
        )

    result = career_fit_service.analyze_career_fit_for_user(
        db,
        user_id=current_user.id,
        career_target=career_target,
        job_description=request_data.job_description,
        user_skills=get_user_skill_names(
            db,
            current_user.id,
        ),
    )

    return {
        "id": result.id,
        "career_target_id": result.career_target_id,
        "job_description": result.job_description,
        "company_name": result.company_name,
        "job_title": result.job_title,
        "match_score": int(result.match_score),
        "matched_skills": json.loads(
            result.matched_skills or "[]"
        ),
        "skill_gaps": json.loads(
            result.skill_gaps or "[]"
        ),
        "strengths": json.loads(
            result.strengths or "[]"
        ),
        "career_insight": result.career_insight or "",
        "roadmap": json.loads(
            result.roadmap or "[]"
        ),
        "next_action": result.next_action or "",
    }


@router.post(
    "",
    response_model=CareerRecommendationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_career_recommendation(
    recommendation_data: CareerRecommendationCreate,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    return career_recommendation_service.create_recommendation(
        db,
        user_id=current_user.id,
        career_target_id=recommendation_data.career_target_id,
        recommendation_type=recommendation_data.recommendation_type,
        title=recommendation_data.title,
        description=recommendation_data.description,
        priority=recommendation_data.priority,
    )


@router.get(
    "",
    response_model=list[CareerRecommendationResponse],
)
def get_career_recommendations(
    db: DatabaseSession,
    current_user: CurrentUser,
):
    return career_recommendation_service.get_user_recommendations(
        db,
        user_id=current_user.id,
    )


@router.patch(
    "/{recommendation_id}/complete",
    response_model=CareerRecommendationResponse,
)
def complete_career_recommendation(
    recommendation_id: int,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    recommendation = (
        career_recommendation_service.complete_recommendation(
            db,
            user_id=current_user.id,
            recommendation_id=recommendation_id,
        )
    )

    if recommendation is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Career recommendation not found",
        )

    return recommendation