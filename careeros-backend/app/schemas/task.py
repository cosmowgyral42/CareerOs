from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=5000)
    goal_id: int | None = None
    priority: str = Field(default="medium", max_length=20)
    due_date: date | None = None


class TaskUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=5000)
    goal_id: int | None = None
    status: str | None = Field(default=None, max_length=30)
    priority: str | None = Field(default=None, max_length=20)
    due_date: date | None = None


class TaskResponse(BaseModel):
    id: int
    user_id: int
    goal_id: int | None
    title: str
    description: str | None
    status: str
    priority: str
    due_date: date | None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)