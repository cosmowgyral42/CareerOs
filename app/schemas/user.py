from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    target_role: str | None
    graduation_year: int | None
    weekly_hours: int | None
    tech_stack_summary: str | None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UserUpdate(BaseModel):
    full_name: str | None = Field(
        default=None,
        min_length=2,
        max_length=100,
    )

    target_role: str | None = Field(
        default=None,
        max_length=100,
    )

    graduation_year: int | None = Field(
        default=None,
        ge=2000,
        le=2100,
    )

    weekly_hours: int | None = Field(
        default=None,
        ge=0,
        le=168,
    )

    tech_stack_summary: str | None = Field(
        default=None,
        max_length=2000,
    )