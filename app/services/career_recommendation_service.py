from sqlalchemy.orm import Session

from app.models.career_recommendation import CareerRecommendation
from app.repositories import career_recommendation_repository


def create_recommendation(
    db: Session,
    *,
    user_id: int,
    career_target_id: int | None,
    recommendation_type: str,
    title: str,
    description: str,
    priority: str = "medium",
) -> CareerRecommendation:
    return career_recommendation_repository.create(
        db,
        user_id=user_id,
        career_target_id=career_target_id,
        recommendation_type=recommendation_type,
        title=title,
        description=description,
        priority=priority,
    )


def get_user_recommendations(
    db: Session,
    *,
    user_id: int,
) -> list[CareerRecommendation]:
    return career_recommendation_repository.get_all_for_user(
        db,
        user_id,
    )


def complete_recommendation(
    db: Session,
    *,
    user_id: int,
    recommendation_id: int,
) -> CareerRecommendation | None:
    recommendation = career_recommendation_repository.get_by_id(
        db,
        recommendation_id,
        user_id,
    )

    if recommendation is None:
        return None

    return career_recommendation_repository.update_status(
        db,
        recommendation,
        "completed",
    )