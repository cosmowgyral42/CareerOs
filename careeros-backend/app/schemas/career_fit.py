from pydantic import BaseModel, Field


class CareerFitAnalyzeRequest(BaseModel):
    career_target_id: int

    job_description: str = Field(
        min_length=100,
        max_length=15000,
    )


class CareerFitSkillGap(BaseModel):
    skill: str

    importance: str

    reason: str


class CareerFitRoadmapPhase(BaseModel):
    title: str

    objective: str

    skills: list[str]

    recommended_projects: list[str]

    recommended_tasks: list[str]


class AICareerFitResult(BaseModel):
    company_name: str

    job_title: str

    match_score: int = Field(
        ge=0,
        le=100,
    )

    matched_skills: list[str]

    skill_gaps: list[
        CareerFitSkillGap
    ]

    strengths: list[str]

    career_insight: str

    roadmap: list[
        CareerFitRoadmapPhase
    ]

    next_action: str


class CareerFitResponse(
    AICareerFitResult
):
    id: int

    career_target_id: int

    job_description: str