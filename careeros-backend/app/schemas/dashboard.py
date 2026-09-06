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

    total_career_targets: int
    active_career_targets: int

    total_skill_gaps: int
    missing_skill_gaps: int
    learning_skill_gaps: int
    acquired_skill_gaps: int

    total_job_matches: int
    average_match_score: float
    latest_match_score: float


class DashboardResponse(BaseModel):
    stats: DashboardStats