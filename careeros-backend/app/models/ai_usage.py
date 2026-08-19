from datetime import date

from sqlalchemy import Date, Integer
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin


class AIUsage(TimestampMixin, Base):
    __tablename__ = "ai_usage"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    usage_date: Mapped[date] = mapped_column(
        Date,
        unique=True,
        nullable=False,
        index=True,
    )

    total_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        server_default="0",
        nullable=False,
    )