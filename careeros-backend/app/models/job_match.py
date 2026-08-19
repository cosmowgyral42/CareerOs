from sqlalchemy import Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin


class JobMatch(TimestampMixin, Base):
    __tablename__ = "job_matches"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    career_target_id: Mapped[int | None] = mapped_column(
        ForeignKey("career_targets.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    company_name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    job_title: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    job_description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    match_score: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    matched_skills: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    missing_skills: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    skill_gaps: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    strengths: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    career_insight: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    roadmap: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    next_action: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    recommendations: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )