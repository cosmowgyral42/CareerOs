from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ResumeAnalysisResponse(BaseModel):
    id: int
    user_id: int
    file_name: str
    job_description: str | None
    status: str
    match_score: int | None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )


class ResumeAnalysisDetail(
    ResumeAnalysisResponse
):
    extracted_text: str
    analysis_result: str | None


class AIResumeResult(BaseModel):
    match_score: int = Field(
        ge=0,
        le=100,
    )

    matched_skills: list[str]
    missing_skills: list[str]
    strengths: list[str]
    weaknesses: list[str]
    recommendations: list[str]
    summary: str