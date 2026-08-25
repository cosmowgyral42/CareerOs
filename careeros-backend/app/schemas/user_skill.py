from pydantic import BaseModel, ConfigDict, Field


SKILL_LEVELS = (
    "beginner",
    "intermediate",
    "advanced",
    "expert",
)


class UserSkillCreate(BaseModel):
    name: str = Field(
        min_length=1,
        max_length=100,
    )

    category: str | None = Field(
        default=None,
        max_length=100,
    )

    description: str | None = Field(
        default=None,
        max_length=5000,
    )

    level: str = Field(
        default="beginner",
        pattern="^(beginner|intermediate|advanced|expert)$",
    )


class UserSkillUpdate(BaseModel):
    level: str = Field(
        pattern="^(beginner|intermediate|advanced|expert)$",
    )


class UserSkillResponse(BaseModel):
    id: int
    skill_id: int
    name: str
    category: str | None
    description: str | None
    level: str

    model_config = ConfigDict(
        from_attributes=True,
    )