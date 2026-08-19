from fastapi import APIRouter

from app.api.deps import CurrentUser, DatabaseSession
from app.schemas.dashboard import DashboardResponse
from app.services import dashboard_service


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get(
    "",
    response_model=DashboardResponse,
)
def get_dashboard(
    db: DatabaseSession,
    current_user: CurrentUser,
):
    return dashboard_service.get_dashboard(
        db,
        current_user.id,
    )