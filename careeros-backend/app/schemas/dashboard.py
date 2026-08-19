from pydantic import BaseModel


class DashboardStats(BaseModel):
    total_goals: int
    active_goals: int
    completed_goals: int

    total_tasks: int
    pending_tasks: int
    completed_tasks: int

    total_projects: int
    active_projects: int

    total_applications: int
    active_applications: int

    total_resources: int


class DashboardResponse(BaseModel):
    stats: DashboardStats