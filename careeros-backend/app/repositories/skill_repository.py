from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.skill import Skill


def get_by_id(
    db: Session,
    skill_id: int,
) -> Skill | None:
    return db.scalar(
        select(Skill).where(
            Skill.id == skill_id,
        )
    )