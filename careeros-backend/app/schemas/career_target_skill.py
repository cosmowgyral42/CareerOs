from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class CareerTargetSkillCreate(BaseModel):
    skill_id: int
    importance: str = Field(
        default="required",
        max_length=30,
    )


class CareerTargetSkillUpdate(BaseModel):
    importance: str = Field(
        max_length=30,
    )


class CareerTargetSkillResponse(BaseModel):
    id: int
    career_target_id: int
    skill_id: int
    importance: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )