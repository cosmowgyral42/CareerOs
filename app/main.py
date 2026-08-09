from fastapi import FastAPI

from app.api.v1.router import api_router
from app.core.error_handlers import register_exception_handlers

app = FastAPI(
    title="CareerOS API",
    description="Backend API for the CareerOS platform",
    version="1.0.0",
)
register_exception_handlers(app)

app.include_router(
    api_router,
    prefix="/api/v1",
)


@app.get("/", tags=["Health"])
def root():
    return {"message": "CareerOS API is running"}


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy"}