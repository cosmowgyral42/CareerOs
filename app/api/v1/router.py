from fastapi import APIRouter

from app.api.v1 import auth, goals, projects, tasks, users
from app.api.v1 import applications, auth, goals, projects, tasks, users

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(goals.router)
api_router.include_router(tasks.router)
api_router.include_router(projects.router)
api_router.include_router(applications.router)