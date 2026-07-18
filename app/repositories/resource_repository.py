from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.resource import Resource


def create(db: Session, user_id: int, data: dict) -> Resource:
    resource = Resource(
        user_id=user_id,
        **data,
    )

    db.add(resource)
    db.commit()
    db.refresh(resource)

    return resource


def get_by_id(
    db: Session,
    resource_id: int,
    user_id: int,
) -> Resource | None:
    return db.scalar(
        select(Resource).where(
            Resource.id == resource_id,
            Resource.user_id == user_id,
        )
    )


def get_all_by_user(
    db: Session,
    user_id: int,
) -> list[Resource]:
    statement = (
        select(Resource)
        .where(Resource.user_id == user_id)
        .order_by(Resource.created_at.desc())
    )

    return list(db.scalars(statement).all())


def update(
    db: Session,
    resource: Resource,
    data: dict,
) -> Resource:
    for field, value in data.items():
        setattr(resource, field, value)

    db.commit()
    db.refresh(resource)

    return resource


def delete(db: Session, resource: Resource) -> None:
    db.delete(resource)
    db.commit()