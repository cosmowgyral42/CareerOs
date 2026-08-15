from datetime import date

from sqlalchemy import select, update
from sqlalchemy.orm import Session

from app.models.ai_usage import AIUsage
from app.models.user_ai_usage import UserAIUsage


def get_or_create_daily_usage(
    db: Session,
    usage_date: date,
) -> AIUsage:
    usage = db.scalar(
        select(AIUsage).where(
            AIUsage.usage_date == usage_date,
        )
    )

    if usage is not None:
        return usage

    usage = AIUsage(
        usage_date=usage_date,
        total_count=0,
    )

    db.add(usage)
    db.commit()
    db.refresh(usage)

    return usage


def get_or_create_user_usage(
    db: Session,
    user_id: int,
    usage_date: date,
) -> UserAIUsage:
    usage = db.scalar(
        select(UserAIUsage).where(
            UserAIUsage.user_id == user_id,
            UserAIUsage.usage_date == usage_date,
        )
    )

    if usage is not None:
        return usage

    usage = UserAIUsage(
        user_id=user_id,
        usage_date=usage_date,
        total_count=0,
    )

    db.add(usage)
    db.commit()
    db.refresh(usage)

    return usage


def increment_global_usage(
    db: Session,
    usage_date: date,
    limit: int,
) -> bool:
    statement = (
        update(AIUsage)
        .where(
            AIUsage.usage_date == usage_date,
            AIUsage.total_count < limit,
        )
        .values(
            total_count=AIUsage.total_count + 1,
        )
    )

    result = db.execute(statement)
    db.commit()

    return result.rowcount == 1


def increment_user_usage(
    db: Session,
    user_id: int,
    usage_date: date,
    limit: int,
) -> bool:
    statement = (
        update(UserAIUsage)
        .where(
            UserAIUsage.user_id == user_id,
            UserAIUsage.usage_date == usage_date,
            UserAIUsage.total_count < limit,
        )
        .values(
            total_count=UserAIUsage.total_count + 1,
        )
    )

    result = db.execute(statement)
    db.commit()

    return result.rowcount == 1


def decrement_global_usage(
    db: Session,
    usage_date: date,
) -> None:
    statement = (
        update(AIUsage)
        .where(
            AIUsage.usage_date == usage_date,
            AIUsage.total_count > 0,
        )
        .values(
            total_count=AIUsage.total_count - 1,
        )
    )

    db.execute(statement)


def decrement_user_usage(
    db: Session,
    user_id: int,
    usage_date: date,
) -> None:
    statement = (
        update(UserAIUsage)
        .where(
            UserAIUsage.user_id == user_id,
            UserAIUsage.usage_date == usage_date,
            UserAIUsage.total_count > 0,
        )
        .values(
            total_count=UserAIUsage.total_count - 1,
        )
    )

    db.execute(statement)