from sqlalchemy import ForeignKey, Integer, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin


class SkillGapProject(TimestampMixin, Base):
    __tablename__ = "skill_gap_projects"

    __table_args__ = (
        UniqueConstraint(
            "skill_gap_id",
            "project_id",
            name="uq_skill_gap_projects_gap_project",
        ),
    )

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    skill_gap_id: Mapped[int] = mapped_column(
        ForeignKey(
            "skill_gaps.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    project_id: Mapped[int] = mapped_column(
        ForeignKey(
            "projects.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )