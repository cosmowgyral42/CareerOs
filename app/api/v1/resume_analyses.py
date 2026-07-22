from typing import Annotated

from fastapi import (
    APIRouter,
    File,
    Form,
    HTTPException,
    UploadFile,
    status,
)

from app.api.deps import CurrentUser, DatabaseSession
from app.schemas.resume_analysis import (
    ResumeAnalysisDetail,
    ResumeAnalysisResponse,
)
from app.services import resume_analysis_service

from app.core.exceptions import (
    AIProviderUnavailableError,
    DailyAILimitExceededError,
)

router = APIRouter(
    prefix="/resume-analyses",
    tags=["Resume Analysis"],
)


@router.post(
    "",
    response_model=ResumeAnalysisResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_resume_analysis(
    db: DatabaseSession,
    current_user: CurrentUser,
    file: Annotated[UploadFile, File(...)],
    job_description: Annotated[str | None, Form()] = None,
):
    content = await file.read()

    try:
        return resume_analysis_service.create_resume_analysis(
            db,
            user_id=current_user.id,
            filename=file.filename,
            content=content,
            job_description=job_description,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


@router.post(
    "/{analysis_id}/analyze",
    response_model=ResumeAnalysisDetail,
)
def analyze_resume_with_ai(
    analysis_id: int,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    analysis = resume_analysis_service.get_resume_analysis(
        db,
        analysis_id,
        current_user.id,
    )

    if analysis is None:
        raise HTTPException(
            status_code=404,
            detail="Resume analysis not found",
        )

    try:
        return resume_analysis_service.run_ai_analysis(
            db,
            analysis,
        )

    except DailyAILimitExceededError as exc:
        raise HTTPException(
            status_code=429,
            detail=(
                "You have used today's 2 free AI analyses. "
                "Please try again tomorrow."
            ),
        ) from exc

    except AIProviderUnavailableError as exc:
        raise HTTPException(
            status_code=503,
            detail=str(exc),
        ) from exc

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc
    
def get_resume_analyses(
    db: DatabaseSession,
    current_user: CurrentUser,
):
    return resume_analysis_service.get_user_resume_analyses(
        db,
        current_user.id,
    )


@router.get(
    "/{analysis_id}",
    response_model=ResumeAnalysisDetail,
)
def get_resume_analysis(
    analysis_id: int,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    analysis = resume_analysis_service.get_resume_analysis(
        db,
        analysis_id,
        current_user.id,
    )

    if analysis is None:
        raise HTTPException(
            status_code=404,
            detail="Resume analysis not found",
        )

    return analysis