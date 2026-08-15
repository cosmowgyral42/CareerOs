import json

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.job_match import JobMatch


def create_job_match(
    db: Session,
    *,
    user_id: int,
    career_target_id: int,
    company_name: str,
    job_title: str,
    job_description: str,
    match_score: float,
    matched_skills: list[str],
    missing_skills: list[str],
    skill_gaps: list[dict],
    strengths: list[str],
    career_insight: str,
    roadmap: list[dict],
    next_action: str,
    recommendations: list[str],
) -> JobMatch:
    job_match = JobMatch(
        user_id=user_id,
        career_target_id=career_target_id,
        company_name=company_name,
        job_title=job_title,
        job_description=job_description,
        match_score=match_score,
        matched_skills=json.dumps(matched_skills),
        missing_skills=json.dumps(missing_skills),
        skill_gaps=json.dumps(skill_gaps),
        strengths=json.dumps(strengths),
        career_insight=career_insight,
        roadmap=json.dumps(roadmap),
        next_action=next_action,
        recommendations=json.dumps(recommendations),
    )

    db.add(job_match)
    db.commit()
    db.refresh(job_match)

    return job_match


def get_by_id(
    db: Session,
    *,
    match_id: int,
    user_id: int,
) -> JobMatch | None:
    return db.scalar(
        select(JobMatch).where(
            JobMatch.id == match_id,
            JobMatch.user_id == user_id,
        )
    )


def get_user_matches(
    db: Session,
    *,
    user_id: int,
) -> list[JobMatch]:
    statement = (
        select(JobMatch)
        .where(JobMatch.user_id == user_id)
        .order_by(JobMatch.created_at.desc())
    )

    return list(db.scalars(statement).all())