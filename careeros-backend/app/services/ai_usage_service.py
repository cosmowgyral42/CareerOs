from datetime import date

from sqlalchemy.orm import Session

from app.core.constants import (
    DAILY_AI_USER_LIMIT,
    GLOBAL_DAILY_AI_LIMIT,
)
from app.core.exceptions import (
    AIDailyQuotaExceededError,
)
from app.repositories import ai_usage_repository


def reserve_ai_call(
    db: Session,
    user_id: int,
    usage_date: date,
) -> bool:
    try:
        global_usage = (
            ai_usage_repository.get_or_create_daily_usage(
                db,
                usage_date,
            )
        )

        user_usage = (
            ai_usage_repository.get_or_create_user_usage(
                db,
                user_id,
                usage_date,
            )
        )

        db.flush()

        if (
            global_usage.total_count
            >= GLOBAL_DAILY_AI_LIMIT
        ):
            db.rollback()
            return False

        if (
            user_usage.total_count
            >= DAILY_AI_USER_LIMIT
        ):
            db.rollback()
            return False

        global_reserved = (
            ai_usage_repository.increment_global_usage(
                db,
                usage_date,
                GLOBAL_DAILY_AI_LIMIT,
            )
        )

        if not global_reserved:
            db.rollback()
            return False

        user_reserved = (
            ai_usage_repository.increment_user_usage(
                db,
                user_id,
                usage_date,
                DAILY_AI_USER_LIMIT,
            )
        )

        if not user_reserved:
            ai_usage_repository.decrement_global_usage(
                db,
                usage_date,
            )

            db.commit()
            return False

        db.commit()

        return True

    except Exception:
        db.rollback()
        raise


def require_ai_call(
    db: Session,
    user_id: int,
    usage_date: date,
) -> None:
    reserved = reserve_ai_call(
        db,
        user_id,
        usage_date,
    )

    if not reserved:
        raise AIDailyQuotaExceededError()


def refund_ai_call(
    db: Session,
    user_id: int,
    usage_date: date,
) -> None:
    try:
        ai_usage_repository.decrement_global_usage(
            db,
            usage_date,
        )

        ai_usage_repository.decrement_user_usage(
            db,
            user_id,
            usage_date,
        )

        db.commit()

    except Exception:
        db.rollback()
        raise