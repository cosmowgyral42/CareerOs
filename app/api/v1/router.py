from fastapi import APIRouter

from app.api.v1 import auth, goals, tasks, users


api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(goals.router)
api_router.include_router(tasks.router)