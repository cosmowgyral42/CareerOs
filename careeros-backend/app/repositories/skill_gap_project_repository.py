from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.skill_gap_project import SkillGapProject


def get_by_identity(
    db: Session,
    *,
    skill_gap_id: int,
    project_id: int,
) -> SkillGapProject | None:
    return db.scalar(
        select(SkillGapProject).where(
            SkillGapProject.skill_gap_id == skill_gap_id,
            SkillGapProject.project_id == project_id,
        )
    )


def create(
    db: Session,
    *,
    skill_gap_id: int,
    project_id: int,
) -> SkillGapProject:
    skill_gap_project = SkillGapProject(
        skill_gap_id=skill_gap_id,
        project_id=project_id,
    )

    db.add(skill_gap_project)
    db.flush()

    return skill_gap_project


def get_all_by_skill_gap(
    db: Session,
    *,
    skill_gap_id: int,
) -> list[SkillGapProject]:
    statement = (
        select(SkillGapProject)
        .where(
            SkillGapProject.skill_gap_id == skill_gap_id,
        )
        .order_by(SkillGapProject.created_at.desc())
    )

    return list(db.scalars(statement).all())


def get_all_by_project(
    db: Session,
    *,
    project_id: int,
) -> list[SkillGapProject]:
    statement = (
        select(SkillGapProject)
        .where(
            SkillGapProject.project_id == project_id,
        )
        .order_by(SkillGapProject.created_at.desc())
    )

    return list(db.scalars(statement).all())


def delete(
    db: Session,
    skill_gap_project: SkillGapProject,
) -> None:
    db.delete(skill_gap_project)
    db.flush()