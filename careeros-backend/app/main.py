from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.error_handlers import register_exception_handlers
from app.core.config import settings

app = FastAPI(
    title="CareerOS API",
    description="Backend API for the CareerOS platform",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_origin,
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
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