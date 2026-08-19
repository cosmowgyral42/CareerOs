from pydantic import BaseModel, ConfigDict, Field


class CareerRecommendationBase(BaseModel):
    recommendation_type: str = Field(min_length=1, max_length=50)
    title: str = Field(min_length=1, max_length=200)
    description: str = Field(min_length=1)
    priority: str = Field(default="medium", min_length=1, max_length=30)


class CareerRecommendationCreate(CareerRecommendationBase):
    career_target_id: int | None = None


class CareerRecommendationResponse(CareerRecommendationBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    career_target_id: int | None
    status: str