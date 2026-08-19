from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin


class CareerTargetSkill(TimestampMixin, Base):
    __tablename__ = "career_target_skills"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    career_target_id: Mapped[int] = mapped_column(
        ForeignKey("career_targets.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    skill_id: Mapped[int] = mapped_column(
        ForeignKey("skills.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    importance: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="required",
        server_default="required",
    )