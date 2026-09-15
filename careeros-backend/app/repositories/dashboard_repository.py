from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.career_target import CareerTarget
from app.models.job_match import JobMatch
from app.models.skill_gap import SkillGap


def count_career_targets(
    db: Session,
    user_id: int,
) -> int:
    statement = select(
        func.count(CareerTarget.id)
    ).where(
        CareerTarget.user_id == user_id
    )

    return int(
        db.scalar(statement) or 0
    )


def count_active_career_targets(
    db: Session,
    user_id: int,
) -> int:
    statement = select(
        func.count(CareerTarget.id)
    ).where(
        CareerTarget.user_id == user_id,
        CareerTarget.is_active.is_(True),
    )

    return int(
        db.scalar(statement) or 0
    )


def count_skill_gaps(
    db: Session,
    user_id: int,
) -> int:
    statement = select(
        func.count(SkillGap.id)
    ).where(
        SkillGap.user_id == user_id
    )

    return int(
        db.scalar(statement) or 0
    )


def count_skill_gaps_by_status(
    db: Session,
    user_id: int,
    status: str,
) -> int:
    statement = select(
        func.count(SkillGap.id)
    ).where(
        SkillGap.user_id == user_id,
        SkillGap.status == status,
    )

    return int(
        db.scalar(statement) or 0
    )


def count_job_matches(
    db: Session,
    user_id: int,
) -> int:
    statement = select(
        func.count(JobMatch.id)
    ).where(
        JobMatch.user_id == user_id
    )

    return int(
        db.scalar(statement) or 0
    )


def get_average_match_score(
    db: Session,
    user_id: int,
) -> float:
    statement = select(
        func.avg(JobMatch.match_score)
    ).where(
        JobMatch.user_id == user_id
    )

    average_score = db.scalar(statement)

    if average_score is None:
        return 0.0

    return round(
        float(average_score),
        2,
    )


def get_latest_match_score(
    db: Session,
    user_id: int,
) -> float:
    statement = (
        select(JobMatch.match_score)
        .where(
            JobMatch.user_id == user_id
        )
        .order_by(
            JobMatch.created_at.desc()
        )
        .limit(1)
    )

    latest_score = db.scalar(statement)

    if latest_score is None:
        return 0.0

    return float(latest_score)