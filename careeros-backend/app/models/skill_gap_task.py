from sqlalchemy import ForeignKey, Integer, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin


class SkillGapTask(TimestampMixin, Base):
    __tablename__ = "skill_gap_tasks"

    __table_args__ = (
        UniqueConstraint(
            "skill_gap_id",
            "task_id",
            name="uq_skill_gap_tasks_gap_task",
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

    task_id: Mapped[int] = mapped_column(
        ForeignKey(
            "tasks.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )