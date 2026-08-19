from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


class ProjectCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=5000)
    tech_stack: str | None = Field(default=None, max_length=500)
    repository_url: str | None = Field(default=None, max_length=500)
    live_url: str | None = Field(default=None, max_length=500)
    target_date: date | None = None


class ProjectUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=5000)
    status: str | None = Field(default=None, max_length=30)
    tech_stack: str | None = Field(default=None, max_length=500)
    repository_url: str | None = Field(default=None, max_length=500)
    live_url: str | None = Field(default=None, max_length=500)
    target_date: date | None = None


class ProjectResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: str | None
    status: str
    tech_stack: str | None
    repository_url: str | None
    live_url: str | None
    target_date: date | None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)