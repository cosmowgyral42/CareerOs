from fastapi import APIRouter

from app.api.deps import CurrentUser, DatabaseSession
from app.repositories import activity_log_repository
from app.schemas.activity_log import ActivityLogResponse

router = APIRouter(
    prefix="/activity-logs",
    tags=["Activity Logs"],
)


@router.get(
    "",
    response_model=list[ActivityLogResponse],
)
def get_activity_logs(
    db: DatabaseSession,
    current_user: CurrentUser,
):
    return activity_log_repository.get_user_logs(
        db,
        current_user.id,
    )


@router.get(
    "/recent",
    response_model=list[ActivityLogResponse],
)
def get_recent_activity_logs(
    db: DatabaseSession,
    current_user: CurrentUser,
):
    return activity_log_repository.get_recent_logs(
        db,
        current_user.id,
    )