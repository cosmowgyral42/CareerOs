from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.error_handlers import register_exception_handlers


app = FastAPI(
    title="CareerOS API",
    description="Backend API for the CareerOS platform",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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