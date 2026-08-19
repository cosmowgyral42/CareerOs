from sqlalchemy.orm import Session

from app.models.internship_application import InternshipApplication
from app.repositories import application_repository
from app.schemas.internship_application import (
    ApplicationCreate,
    ApplicationUpdate,
)


def create_application(
    db: Session,
    user_id: int,
    application_data: ApplicationCreate,
) -> InternshipApplication:
    return application_repository.create(
        db,
        user_id,
        application_data.model_dump(),
    )


def get_application(
    db: Session,
    application_id: int,
    user_id: int,
) -> InternshipApplication | None:
    return application_repository.get_by_id(
        db,
        application_id,
        user_id,
    )


def get_user_applications(
    db: Session,
    user_id: int,
) -> list[InternshipApplication]:
    return application_repository.get_all_by_user(db, user_id)


def update_application(
    db: Session,
    application: InternshipApplication,
    application_data: ApplicationUpdate,
) -> InternshipApplication:
    data = application_data.model_dump(exclude_unset=True)

    return application_repository.update(
        db,
        application,
        data,
    )


def delete_application(
    db: Session,
    application: InternshipApplication,
) -> None:
    application_repository.delete(db, application)