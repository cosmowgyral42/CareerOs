from sqlalchemy.orm import Session

from app.models.resource import Resource
from app.repositories import resource_repository
from app.schemas.resource import (
    ResourceCreate,
    ResourceUpdate,
)


def create_resource(
    db: Session,
    user_id: int,
    resource_data: ResourceCreate,
) -> Resource:
    return resource_repository.create(
        db,
        user_id,
        resource_data.model_dump(),
    )


def get_resource(
    db: Session,
    resource_id: int,
    user_id: int,
) -> Resource | None:
    return resource_repository.get_by_id(
        db,
        resource_id,
        user_id,
    )


def get_user_resources(
    db: Session,
    user_id: int,
) -> list[Resource]:
    return resource_repository.get_all_by_user(db, user_id)


def update_resource(
    db: Session,
    resource: Resource,
    resource_data: ResourceUpdate,
) -> Resource:
    data = resource_data.model_dump(exclude_unset=True)

    return resource_repository.update(
        db,
        resource,
        data,
    )


def delete_resource(
    db: Session,
    resource: Resource,
) -> None:
    resource_repository.delete(db, resource)