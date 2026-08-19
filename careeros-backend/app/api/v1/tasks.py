from fastapi import APIRouter, HTTPException, Response, status

from app.api.deps import CurrentUser, DatabaseSession
from app.schemas.task import TaskCreate, TaskResponse, TaskUpdate
from app.services import task_service


router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(task_data: TaskCreate, db: DatabaseSession, current_user: CurrentUser):
    try:
        return task_service.create_task(db, current_user.id, task_data)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("", response_model=list[TaskResponse])
def get_tasks(db: DatabaseSession, current_user: CurrentUser):
    return task_service.get_user_tasks(db, current_user.id)


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(task_id: int, db: DatabaseSession, current_user: CurrentUser):
    task = task_service.get_task(db, task_id, current_user.id)

    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    return task


@router.patch("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    task_data: TaskUpdate,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    task = task_service.get_task(db, task_id, current_user.id)

    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    try:
        return task_service.update_task(
            db, task, current_user.id, task_data
        )
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, db: DatabaseSession, current_user: CurrentUser):
    task = task_service.get_task(db, task_id, current_user.id)

    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    task_service.delete_task(db, task)
    return Response(status_code=status.HTTP_204_NO_CONTENT)