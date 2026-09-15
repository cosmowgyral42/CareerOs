from __future__ import annotations
from sqlalchemy import (
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.skill import Skill
from app.models.base import Base, TimestampMixin


class SkillGap(TimestampMixin, Base):
    __tablename__ = "skill_gaps"

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "career_target_id",
            "skill_id",
            name="uq_skill_gaps_user_target_skill",
        ),
    )

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    career_target_id: Mapped[int] = mapped_column(
        ForeignKey(
            "career_targets.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    skill_id: Mapped[int] = mapped_column(
        ForeignKey(
            "skills.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )
    skill: Mapped["Skill"] = relationship(
        "Skill",
    )

    goal_id: Mapped[int | None] = mapped_column(
        ForeignKey(
            "goals.id",
            ondelete="SET NULL",
        ),
        nullable=True,
        index=True,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="missing",
        server_default="missing",
    )

    importance: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="medium",
        server_default="medium",
    )

    notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    @property
    def skill_name(self) -> str:
        return self.skill.name