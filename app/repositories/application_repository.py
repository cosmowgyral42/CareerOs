from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.internship_application import InternshipApplication


def create(
    db: Session,
    user_id: int,
    data: dict,
) -> InternshipApplication:
    application = InternshipApplication(
        user_id=user_id,
        **data,
    )

    db.add(application)
    db.commit()
    db.refresh(application)

    return application


def get_by_id(
    db: Session,
    application_id: int,
    user_id: int,
) -> InternshipApplication | None:
    return db.scalar(
        select(InternshipApplication).where(
            InternshipApplication.id == application_id,
            InternshipApplication.user_id == user_id,
        )
    )


def get_all_by_user(
    db: Session,
    user_id: int,
) -> list[InternshipApplication]:
    statement = (
        select(InternshipApplication)
        .where(InternshipApplication.user_id == user_id)
        .order_by(InternshipApplication.created_at.desc())
    )

    return list(db.scalars(statement).all())


def update(
    db: Session,
    application: InternshipApplication,
    data: dict,
) -> InternshipApplication:
    for field, value in data.items():
        setattr(application, field, value)

    db.commit()
    db.refresh(application)

    return application


def delete(
    db: Session,
    application: InternshipApplication,
) -> None:
    db.delete(application)
    db.commit()