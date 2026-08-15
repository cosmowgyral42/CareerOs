from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models.career_target import CareerTarget
from app.repositories import career_fit_repository
from app.services.ai_career_fit_service import analyze_career_fit
from app.services.ai_usage_service import (
    refund_ai_call,
    require_ai_call,
)


def analyze_career_fit_for_user(
    db: Session,
    *,
    user_id: int,
    career_target: CareerTarget,
    job_description: str,
    user_skills: list[str],
):
    usage_date = datetime.now(timezone.utc).date()

    # Reserve exactly ONE call from the shared CareerOS AI quota.
    require_ai_call(
        db,
        user_id,
        usage_date,
    )

    try:
        result = analyze_career_fit(
            target_role=career_target.target_role,
            target_level=career_target.target_level,
            target_description=career_target.description,
            user_skills=user_skills,
            job_description=job_description,
        )

        skill_gaps = [
            gap.model_dump()
            for gap in result.skill_gaps
        ]

        missing_skills = [
            gap.skill
            for gap in result.skill_gaps
        ]

        roadmap = [
            phase.model_dump()
            for phase in result.roadmap
        ]

        recommendations = [
            result.next_action,
            *[
                phase.objective
                for phase in result.roadmap
            ],
        ]

        return career_fit_repository.create_job_match(
            db,
            user_id=user_id,
            career_target_id=career_target.id,
            company_name=result.company_name,
            job_title=result.job_title,
            job_description=job_description,
            match_score=float(result.match_score),
            matched_skills=result.matched_skills,
            missing_skills=missing_skills,
            skill_gaps=skill_gaps,
            strengths=result.strengths,
            career_insight=result.career_insight,
            roadmap=roadmap,
            next_action=result.next_action,
            recommendations=recommendations,
        )

    except Exception:
        # Something failed after quota reservation.
        # Return that AI call to the user.
        refund_ai_call(
            db,
            user_id,
            usage_date,
        )
        raise