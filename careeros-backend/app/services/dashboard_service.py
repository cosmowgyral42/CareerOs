from sqlalchemy.orm import Session

from app.repositories import (
    application_repository,
    goal_repository,
    project_repository,
    resource_repository,
    task_repository,
)
from app.schemas.dashboard import (
    DashboardResponse,
    DashboardStats,
)


def get_dashboard(
    db: Session,
    user_id: int,
) -> DashboardResponse:
    stats = DashboardStats(
        total_goals=goal_repository.count_by_user_and_status(
            db, user_id
        ),
        active_goals=goal_repository.count_by_user_and_status(
            db, user_id, "active"
        ),
        completed_goals=goal_repository.count_by_user_and_status(
            db, user_id, "completed"
        ),

        total_tasks=task_repository.count_by_user_and_status(
            db, user_id
        ),
        pending_tasks=task_repository.count_by_user_and_status(
            db, user_id, "pending"
        ),
        completed_tasks=task_repository.count_by_user_and_status(
            db, user_id, "completed"
        ),

        total_projects=project_repository.count_by_user_and_status(
            db, user_id
        ),
        active_projects=project_repository.count_by_user_and_status(
            db, user_id, "in_progress"
        ),

        total_applications=application_repository.count_by_user_and_status(
            db, user_id
        ),
        active_applications=application_repository.count_by_user_and_status(
            db, user_id, "interview"
        ),

        total_resources=resource_repository.count_by_user(
            db, user_id
        ),
    )

    return DashboardResponse(stats=stats)