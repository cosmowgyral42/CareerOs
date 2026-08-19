from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.core.error_codes import ErrorCode
from app.core.exceptions import (
    AIDailyQuotaExceededError,
    AIProviderUnavailableError,
    EmailAlreadyExistsError,
)


def register_exception_handlers(app: FastAPI) -> None:

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request,
        exc: RequestValidationError,
    ):
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "error": {
                    "code": ErrorCode.VALIDATION_ERROR,
                    "message": "Validation failed",
                    "details": exc.errors(),
                }
            },
        )

    @app.exception_handler(AIProviderUnavailableError)
    async def ai_provider_exception_handler(
        request: Request,
        exc: AIProviderUnavailableError,
    ):
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "error": {
                    "code": ErrorCode.AI_PROVIDER_UNAVAILABLE,
                    "message": str(exc),
                }
            },
        )

    @app.exception_handler(AIDailyQuotaExceededError)
    async def ai_daily_quota_exception_handler(
        request: Request,
        exc: AIDailyQuotaExceededError,
    ):
        return JSONResponse(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            content={
                "error": {
                    "code": ErrorCode.AI_DAILY_LIMIT,
                    "message": str(exc),
                }
            },
        )

    @app.exception_handler(EmailAlreadyExistsError)
    async def email_exists_exception_handler(
        request: Request,
        exc: EmailAlreadyExistsError,
    ):
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content={
                "error": {
                    "code": ErrorCode.AUTH_EMAIL_EXISTS,
                    "message": str(exc),
                }
            },
        )

    @app.exception_handler(HTTPException)
    async def http_exception_handler(
        request: Request,
        exc: HTTPException,
    ):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": {
                    "code": ErrorCode.INTERNAL_SERVER_ERROR,
                    "message": str(exc.detail),
                }
            },
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(
        request: Request,
        exc: Exception,
    ):
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "error": {
                    "code": ErrorCode.INTERNAL_SERVER_ERROR,
                    "message": "An unexpected error occurred.",
                }
            },
        )