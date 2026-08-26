from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin


class ResumeAnalysis(TimestampMixin, Base):
    __tablename__ = "resume_analyses"

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

    file_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    job_description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    extracted_text: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="pending",
        server_default="pending",
        nullable=False,
    )

    match_score: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    analysis_result: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )