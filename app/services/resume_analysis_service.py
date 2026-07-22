from sqlalchemy.orm import Session

from app.models.resume_analysis import ResumeAnalysis
from app.repositories import resume_analysis_repository
from app.utils.text_analysis import extract_resume_text
from datetime import datetime, timezone

from app.core.constants import DAILY_AI_ANALYSIS_LIMIT
from app.core.exceptions import DailyAILimitExceededError
from app.services.ai_resume_service import analyze_resume


def create_resume_analysis(
    db: Session,
    *,
    user_id: int,
    filename: str | None,
    content: bytes,
    job_description: str | None,
) -> ResumeAnalysis:
    extracted_text = extract_resume_text(
        filename,
        content,
    )

    return resume_analysis_repository.create(
        db,
        user_id=user_id,
        file_name=filename or "resume",
        job_description=job_description,
        extracted_text=extracted_text,
    )


def get_resume_analysis(
    db: Session,
    analysis_id: int,
    user_id: int,
) -> ResumeAnalysis | None:
    return resume_analysis_repository.get_by_id(
        db,
        analysis_id,
        user_id,
    )


def get_user_resume_analyses(
    db: Session,
    user_id: int,
) -> list[ResumeAnalysis]:
    return resume_analysis_repository.get_all_by_user(
        db,
        user_id,
    )

def run_ai_analysis(
    db: Session,
    analysis: ResumeAnalysis,
) -> ResumeAnalysis:
    # AI analysis requires a job description.
    if not analysis.job_description:
        raise ValueError(
            "A job description is required for AI analysis"
        )

    # Do not call OpenRouter again for an already completed analysis.
    if analysis.status == "completed":
        return analysis

    # Calculate the beginning of the current UTC day.
    now = datetime.now(timezone.utc)

    start_of_day = now.replace(
        hour=0,
        minute=0,
        second=0,
        microsecond=0,
    )

    # Count this user's successful AI analyses today.
    used_today = resume_analysis_repository.count_completed_since(
        db,
        analysis.user_id,
        start_of_day,
    )

    # Block the request after two successful analyses.
    if used_today >= DAILY_AI_ANALYSIS_LIMIT:
        raise DailyAILimitExceededError(
            "Daily AI analysis limit reached"
        )

    # Call OpenRouter through our isolated AI service.
    result = analyze_resume(
        analysis.extracted_text,
        analysis.job_description,
    )

    # Store the validated AI result.
    return resume_analysis_repository.save_ai_result(
        db,
        analysis,
        match_score=result.match_score,
        analysis_result=result.model_dump_json(),
    )