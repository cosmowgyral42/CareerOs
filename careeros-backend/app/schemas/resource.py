from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ResourceCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    url: str | None = Field(default=None, max_length=1000)
    resource_type: str = Field(default="other", max_length=50)
    topic: str | None = Field(default=None, max_length=100)
    notes: str | None = Field(default=None, max_length=5000)
    status: str = Field(default="saved", max_length=30)


class ResourceUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    url: str | None = Field(default=None, max_length=1000)
    resource_type: str | None = Field(default=None, max_length=50)
    topic: str | None = Field(default=None, max_length=100)
    notes: str | None = Field(default=None, max_length=5000)
    status: str | None = Field(default=None, max_length=30)


class ResourceResponse(BaseModel):
    id: int
    user_id: int
    title: str
    url: str | None
    resource_type: str
    topic: str | None
    notes: str | None
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)