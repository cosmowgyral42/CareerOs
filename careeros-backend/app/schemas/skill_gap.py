from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class SkillGapCreate(BaseModel):
    career_target_id: int
    skill_id: int
    goal_id: int | None = None

    status: str = Field(
        default="missing",
        pattern="^(missing|learning|developing|acquired)$",
    )

    importance: str = Field(
        default="medium",
        pattern="^(low|medium|high)$",
    )

    notes: str | None = Field(
        default=None,
        max_length=5000,
    )


class SkillGapUpdate(BaseModel):
    goal_id: int | None = None

    status: str | None = Field(
        default=None,
        pattern="^(missing|learning|developing|acquired)$",
    )

    importance: str | None = Field(
        default=None,
        pattern="^(low|medium|high)$",
    )

    notes: str | None = Field(
        default=None,
        max_length=5000,
    )


class SkillGapResponse(BaseModel):
    id: int
    user_id: int
    career_target_id: int
    skill_id: int
    goal_id: int | None
    status: str
    importance: str
    notes: str | None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )