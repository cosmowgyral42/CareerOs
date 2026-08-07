from fastapi import APIRouter
from app.api.v1 import activity_logs

from app.api.v1 import applications, auth, resume_analyses, dashboard, goals, projects, resources, tasks, users

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(goals.router)
api_router.include_router(tasks.router)
api_router.include_router(projects.router)
api_router.include_router(applications.router)
api_router.include_router(resources.router)
api_router.include_router(dashboard.router)
api_router.include_router(resume_analyses.router)
api_router.include_router(activity_logs.router)