from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.resume_analysis import ResumeAnalysis
from datetime import datetime

from sqlalchemy import func, select

def create(
    db: Session,
    *,
    user_id: int,
    file_name: str,
    job_description: str | None,
    extracted_text: str,
) -> ResumeAnalysis:
    analysis = ResumeAnalysis(
        user_id=user_id,
        file_name=file_name,
        job_description=job_description,
        extracted_text=extracted_text,
        status="pending",
    )

    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    return analysis


def get_by_id(
    db: Session,
    analysis_id: int,
    user_id: int,
) -> ResumeAnalysis | None:
    return db.scalar(
        select(ResumeAnalysis).where(
            ResumeAnalysis.id == analysis_id,
            ResumeAnalysis.user_id == user_id,
        )
    )


def get_all_by_user(
    db: Session,
    user_id: int,
) -> list[ResumeAnalysis]:
    statement = (
        select(ResumeAnalysis)
        .where(ResumeAnalysis.user_id == user_id)
        .order_by(ResumeAnalysis.created_at.desc())
    )

    return list(db.scalars(statement).all())

def count_completed_between(
    db: Session,
    user_id: int,
    start_utc: datetime,
    end_utc: datetime,
) -> int:
    statement = select(
        func.count(ResumeAnalysis.id)
    ).where(
        ResumeAnalysis.user_id == user_id,
        ResumeAnalysis.status == "completed",
        ResumeAnalysis.updated_at >= start_utc,
        ResumeAnalysis.updated_at < end_utc,
    )
    print(db.scalar(statement))
    return db.scalar(statement) or 0

def save_ai_result(
    db: Session,
    analysis: ResumeAnalysis,
    *,
    match_score: int,
    analysis_result: str,
) -> ResumeAnalysis:
    analysis.match_score = match_score
    analysis.analysis_result = analysis_result
    analysis.status = "completed"

    db.commit()
    db.refresh(analysis)

    return analysis