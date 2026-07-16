from datetime import datetime

from sqlalchemy import Boolean, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin


class User(TimestampMixin, Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    full_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    target_role: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    graduation_year: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    weekly_hours: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    tech_stack_summary: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    last_login_at: Mapped[datetime | None] = mapped_column(
        nullable=True,
    )