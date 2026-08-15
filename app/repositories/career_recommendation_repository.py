from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.career_recommendation import CareerRecommendation


def create(
    db: Session,
    *,
    user_id: int,
    career_target_id: int | None,
    recommendation_type: str,
    title: str,
    description: str,
    priority: str = "medium",
) -> CareerRecommendation:
    recommendation = CareerRecommendation(
        user_id=user_id,
        career_target_id=career_target_id,
        recommendation_type=recommendation_type,
        title=title,
        description=description,
        priority=priority,
    )

    db.add(recommendation)
    db.commit()
    db.refresh(recommendation)

    return recommendation


def get_by_id(
    db: Session,
    recommendation_id: int,
    user_id: int,
) -> CareerRecommendation | None:
    return db.scalar(
        select(CareerRecommendation).where(
            CareerRecommendation.id == recommendation_id,
            CareerRecommendation.user_id == user_id,
        )
    )


def get_all_for_user(
    db: Session,
    user_id: int,
) -> list[CareerRecommendation]:
    return list(
        db.scalars(
            select(CareerRecommendation)
            .where(CareerRecommendation.user_id == user_id)
            .order_by(CareerRecommendation.created_at.desc())
        ).all()
    )


def update_status(
    db: Session,
    recommendation: CareerRecommendation,
    status: str,
) -> CareerRecommendation:
    recommendation.status = status

    db.commit()
    db.refresh(recommendation)

    return recommendation