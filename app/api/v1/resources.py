from fastapi import APIRouter, HTTPException, Response, status

from app.api.deps import CurrentUser, DatabaseSession
from app.schemas.resource import (
    ResourceCreate,
    ResourceResponse,
    ResourceUpdate,
)
from app.services import resource_service


router = APIRouter(
    prefix="/resources",
    tags=["Resources"],
)


@router.post(
    "",
    response_model=ResourceResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_resource(
    resource_data: ResourceCreate,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    return resource_service.create_resource(
        db,
        current_user.id,
        resource_data,
    )


@router.get("", response_model=list[ResourceResponse])
def get_resources(
    db: DatabaseSession,
    current_user: CurrentUser,
):
    return resource_service.get_user_resources(
        db,
        current_user.id,
    )


@router.get(
    "/{resource_id}",
    response_model=ResourceResponse,
)
def get_resource(
    resource_id: int,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    resource = resource_service.get_resource(
        db,
        resource_id,
        current_user.id,
    )

    if resource is None:
        raise HTTPException(
            status_code=404,
            detail="Resource not found",
        )

    return resource


@router.patch(
    "/{resource_id}",
    response_model=ResourceResponse,
)
def update_resource(
    resource_id: int,
    resource_data: ResourceUpdate,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    resource = resource_service.get_resource(
        db,
        resource_id,
        current_user.id,
    )

    if resource is None:
        raise HTTPException(
            status_code=404,
            detail="Resource not found",
        )

    return resource_service.update_resource(
        db,
        resource,
        resource_data,
    )


@router.delete(
    "/{resource_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_resource(
    resource_id: int,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    resource = resource_service.get_resource(
        db,
        resource_id,
        current_user.id,
    )

    if resource is None:
        raise HTTPException(
            status_code=404,
            detail="Resource not found",
        )

    resource_service.delete_resource(db, resource)

    return Response(status_code=status.HTTP_204_NO_CONTENT)