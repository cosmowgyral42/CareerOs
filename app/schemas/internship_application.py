from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


class ApplicationCreate(BaseModel):
    company_name: str = Field(min_length=1, max_length=200)
    role: str = Field(min_length=1, max_length=200)
    job_url: str | None = Field(default=None, max_length=1000)
    status: str = Field(default="saved", max_length=30)
    applied_date: date | None = None
    deadline: date | None = None
    notes: str | None = Field(default=None, max_length=5000)


class ApplicationUpdate(BaseModel):
    company_name: str | None = Field(default=None, min_length=1, max_length=200)
    role: str | None = Field(default=None, min_length=1, max_length=200)
    job_url: str | None = Field(default=None, max_length=1000)
    status: str | None = Field(default=None, max_length=30)
    applied_date: date | None = None
    deadline: date | None = None
    notes: str | None = Field(default=None, max_length=5000)


class ApplicationResponse(BaseModel):
    id: int
    user_id: int
    company_name: str
    role: str
    job_url: str | None
    status: str
    applied_date: date | None
    deadline: date | None
    notes: str | None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)