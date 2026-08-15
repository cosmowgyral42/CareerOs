from app.core.error_codes import ErrorCode


class CareerOSError(Exception):
    def __init__(
        self,
        message: str,
        code: ErrorCode,
    ):
        self.message = message
        self.code = code
        super().__init__(message)


class EmailAlreadyExistsError(CareerOSError):
    def __init__(self):
        super().__init__(
            "Email is already registered",
            ErrorCode.AUTH_EMAIL_EXISTS,
        )


class AIProviderUnavailableError(CareerOSError):
    def __init__(
        self,
        message: str = "AI provider unavailable",
    ):
        super().__init__(
            message,
            ErrorCode.AI_PROVIDER_UNAVAILABLE,
        )


class DailyAILimitExceededError(CareerOSError):
    def __init__(
        self,
        message: str = "Daily AI analysis limit reached",
    ):
        super().__init__(
            message,
            ErrorCode.AI_DAILY_LIMIT,
        )

class AIDailyQuotaExceededError(CareerOSError):
    def __init__(
        self,
        message: str = "Daily AI usage limit reached",
    ):
        super().__init__(
            message,
            ErrorCode.AI_DAILY_LIMIT,
        )