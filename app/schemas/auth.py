from pydantic import BaseModel, EmailStr, field_validator , Field
from app.utils.timezone import validate_timezone


class UserRegister(BaseModel):
    full_name: str = Field(
        min_length=2,
        max_length=100,
    )

    email: EmailStr

    password: str = Field(
        min_length=8,
        max_length=128,
    )
    timezone: str = "UTC"
    
    @field_validator("timezone")
    @classmethod
    def validate_user_timezone(cls, value: str) -> str:
        return validate_timezone(value)



class UserLogin(BaseModel):
    email: EmailStr

    password: str = Field(
        min_length=8,
        max_length=128,
    )


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"