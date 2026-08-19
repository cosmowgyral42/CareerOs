from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.activity_log import ActivityLog


def create_log(
    db: Session,
    *,
    user_id: int,
    action: str,
    entity_type: str,
    entity_id: int | None = None,
    payload: dict | None = None,
) -> ActivityLog:
    log = ActivityLog(
        user_id=user_id,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        payload=payload,
    )

    db.add(log)
    db.commit()
    db.refresh(log)

    return log


def get_user_logs(
    db: Session,
    user_id: int,
) -> list[ActivityLog]:
    statement = (
        select(ActivityLog)
        .where(ActivityLog.user_id == user_id)
        .order_by(ActivityLog.created_at.desc())
    )

    return list(db.scalars(statement).all())


def get_recent_logs(
    db: Session,
    user_id: int,
    limit: int = 10,
) -> list[ActivityLog]:
    statement = (
        select(ActivityLog)
        .where(ActivityLog.user_id == user_id)
        .order_by(ActivityLog.created_at.desc())
        .limit(limit)
    )

    return list(db.scalars(statement).all())