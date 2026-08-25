from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


class CareerTargetCreate(BaseModel):
    title: str = Field(
        min_length=1,
        max_length=150,
    )
    target_role: str = Field(
        min_length=1,
        max_length=100,
    )
    target_level: str | None = Field(
        default=None,
        max_length=50,
    )
    description: str | None = Field(
        default=None,
        max_length=5000,
    )
    target_date: date | None = None


class CareerTargetUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=150,
    )
    target_role: str | None = Field(
        default=None,
        min_length=1,
        max_length=100,
    )
    target_level: str | None = Field(
        default=None,
        max_length=50,
    )
    description: str | None = Field(
        default=None,
        max_length=5000,
    )
    target_date: date | None = None
    is_active: bool | None = None


class CareerTargetResponse(BaseModel):
    id: int
    user_id: int
    title: str
    target_role: str
    target_level: str | None
    description: str | None
    target_date: date | None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )