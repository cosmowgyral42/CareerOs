from fastapi import APIRouter, HTTPException, Response, status

from app.api.deps import CurrentUser, DatabaseSession
from app.schemas.internship_application import (
    ApplicationCreate,
    ApplicationResponse,
    ApplicationUpdate,
)
from app.services import application_service


router = APIRouter(
    prefix="/applications",
    tags=["Applications"],
)


@router.post(
    "",
    response_model=ApplicationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_application(
    application_data: ApplicationCreate,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    return application_service.create_application(
        db,
        current_user.id,
        application_data,
    )


@router.get("", response_model=list[ApplicationResponse])
def get_applications(
    db: DatabaseSession,
    current_user: CurrentUser,
):
    return application_service.get_user_applications(
        db,
        current_user.id,
    )


@router.get(
    "/{application_id}",
    response_model=ApplicationResponse,
)
def get_application(
    application_id: int,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    application = application_service.get_application(
        db,
        application_id,
        current_user.id,
    )

    if application is None:
        raise HTTPException(
            status_code=404,
            detail="Application not found",
        )

    return application


@router.patch(
    "/{application_id}",
    response_model=ApplicationResponse,
)
def update_application(
    application_id: int,
    application_data: ApplicationUpdate,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    application = application_service.get_application(
        db,
        application_id,
        current_user.id,
    )

    if application is None:
        raise HTTPException(
            status_code=404,
            detail="Application not found",
        )

    return application_service.update_application(
        db,
        application,
        application_data,
    )


@router.delete(
    "/{application_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_application(
    application_id: int,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    application = application_service.get_application(
        db,
        application_id,
        current_user.id,
    )

    if application is None:
        raise HTTPException(
            status_code=404,
            detail="Application not found",
        )

    application_service.delete_application(db, application)

    return Response(status_code=status.HTTP_204_NO_CONTENT)