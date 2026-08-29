from datetime import datetime
from app.utils.timezone import validate_timezone
from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
)

from app.utils.timezone import validate_timezone

from pydantic import field_validator
class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    target_role: str | None
    graduation_year: int | None
    weekly_hours: int | None
    tech_stack_summary: str | None
    is_active: bool
    created_at: datetime
    updated_at: datetime
    timezone: str

    model_config = ConfigDict(
        from_attributes=True,
    )


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

    timezone: str | None = Field(
        default=None,
        min_length=1,
        max_length=64,
    )

    @field_validator("timezone")
    @classmethod
    def validate_user_timezone(
        cls,
        value: str | None,
    ) -> str | None:
        if value is None:
            return value

        return validate_timezone(value)