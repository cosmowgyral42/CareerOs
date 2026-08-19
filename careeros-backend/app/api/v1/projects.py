from fastapi import APIRouter, HTTPException, Response, status

from app.api.deps import CurrentUser, DatabaseSession
from app.schemas.project import (
    ProjectCreate,
    ProjectResponse,
    ProjectUpdate,
)
from app.services import project_service


router = APIRouter(
    prefix="/projects",
    tags=["Projects"],
)


@router.post(
    "",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_project(
    project_data: ProjectCreate,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    return project_service.create_project(
        db,
        current_user.id,
        project_data,
    )


@router.get("", response_model=list[ProjectResponse])
def get_projects(
    db: DatabaseSession,
    current_user: CurrentUser,
):
    return project_service.get_user_projects(
        db,
        current_user.id,
    )


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(
    project_id: int,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    project = project_service.get_project(
        db,
        project_id,
        current_user.id,
    )

    if project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    return project


@router.patch("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int,
    project_data: ProjectUpdate,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    project = project_service.get_project(
        db,
        project_id,
        current_user.id,
    )

    if project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    return project_service.update_project(
        db,
        project,
        project_data,
    )


@router.delete(
    "/{project_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_project(
    project_id: int,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    project = project_service.get_project(
        db,
        project_id,
        current_user.id,
    )

    if project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    project_service.delete_project(db, project)

    return Response(status_code=status.HTTP_204_NO_CONTENT)