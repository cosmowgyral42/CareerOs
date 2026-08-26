from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models.resume_analysis import ResumeAnalysis
from app.repositories import resume_analysis_repository
from app.services.activity_log_services import log_activity
from app.services.ai_resume_service import analyze_resume
from app.services.ai_usage_service import (
    refund_ai_call,
    require_ai_call,
)
from app.utils.text_analysis import extract_resume_text


MAX_RESUME_SIZE = 10 * 1024 * 1024

ALLOWED_EXTENSIONS = {
    ".pdf",
    ".docx",
}


def _validate_resume_file(
    filename: str | None,
    content: bytes,
) -> None:
    if not filename:
        raise ValueError(
            "A resume filename is required."
        )

    if not content:
        raise ValueError(
            "The uploaded resume is empty."
        )

    if len(content) > MAX_RESUME_SIZE:
        raise ValueError(
            "Resume file must be 10 MB or smaller."
        )

    normalized_name = filename.strip().lower()

    extension = ""

    if "." in normalized_name:
        extension = (
            "." + normalized_name.rsplit(".", 1)[1]
        )

    if extension not in ALLOWED_EXTENSIONS:
        raise ValueError(
            "Unsupported resume format. "
            "Only PDF and DOCX files are allowed."
        )

    if extension == ".pdf":
        if not content.startswith(b"%PDF"):
            raise ValueError(
                "The uploaded file is not a valid PDF."
            )

    if extension == ".docx":
        if not content.startswith(b"PK"):
            raise ValueError(
                "The uploaded file is not a valid DOCX."
            )


def create_resume_analysis(
    db: Session,
    *,
    user_id: int,
    filename: str | None,
    content: bytes,
    job_description: str | None,
) -> ResumeAnalysis:
    _validate_resume_file(
        filename,
        content,
    )

    normalized_job_description = (
        job_description.strip()
        if job_description
        else None
    )

    extracted_text = extract_resume_text(
        filename,
        content,
    )

    if not extracted_text.strip():
        raise ValueError(
            "Could not extract readable text from the resume."
        )

    analysis = resume_analysis_repository.create(
        db,
        user_id=user_id,
        file_name=filename.strip(),
        job_description=normalized_job_description,
        extracted_text=extracted_text,
    )

    log_activity(
        db,
        user_id=user_id,
        action="resume_uploaded",
        entity_type="resume_analysis",
        entity_id=analysis.id,
        payload={
            "file_name": analysis.file_name,
        },
    )

    return analysis


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
    if not analysis.job_description:
        raise ValueError(
            "A job description is required for AI analysis."
        )

    if analysis.status == "completed":
        return analysis

    usage_date = datetime.now(
        timezone.utc
    ).date()

    require_ai_call(
        db,
        analysis.user_id,
        usage_date,
    )

    try:
        result = analyze_resume(
            analysis.extracted_text,
            analysis.job_description,
        )

    except Exception:
        refund_ai_call(
            db,
            analysis.user_id,
            usage_date,
        )
        raise

    analysis = resume_analysis_repository.save_ai_result(
        db,
        analysis,
        match_score=result.match_score,
        analysis_result=result.model_dump_json(),
    )

    log_activity(
        db,
        user_id=analysis.user_id,
        action="resume_analyzed",
        entity_type="resume_analysis",
        entity_id=analysis.id,
        payload={
            "match_score": analysis.match_score,
        },
    )

    return analysis