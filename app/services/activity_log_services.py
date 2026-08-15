from sqlalchemy.orm import Session

from app.repositories import activity_log_repository


def log_activity(
    db: Session,
    *,
    user_id: int,
    action: str,
    entity_type: str,
    entity_id: int | None = None,
    payload: dict | None = None,
):
    return activity_log_repository.create_log(
        db,
        user_id=user_id,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        payload=payload,
    )