from pydantic import BaseModel, Field


class UserSkillCreate(BaseModel):
    name: str = Field(
        min_length=1,
        max_length=100,
    )
    category: str | None = Field(
        default=None,
        max_length=100,
    )
    description: str | None = None


class UserSkillResponse(BaseModel):
    id: int
    name: str
    category: str | None
    description: str | None

    model_config = {
        "from_attributes": True,
    }