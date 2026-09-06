"""add skill gap task relationships

Revision ID: 5fed469d2b4f
Revises: ba7c2cab4f07
Create Date: 2026-09-05 11:13:35.565601

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5fed469d2b4f'
down_revision: Union[str, Sequence[str], None] = 'ba7c2cab4f07'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "skill_gap_tasks",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("skill_gap_id", sa.Integer(), nullable=False),
        sa.Column("task_id", sa.Integer(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["skill_gap_id"],
            ["skill_gaps.id"],
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["task_id"],
            ["tasks.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "skill_gap_id",
            "task_id",
            name="uq_skill_gap_tasks_gap_task",
        ),
    )

    op.create_index(
        op.f("ix_skill_gap_tasks_id"),
        "skill_gap_tasks",
        ["id"],
        unique=False,
    )

    op.create_index(
        op.f("ix_skill_gap_tasks_skill_gap_id"),
        "skill_gap_tasks",
        ["skill_gap_id"],
        unique=False,
    )

    op.create_index(
        op.f("ix_skill_gap_tasks_task_id"),
        "skill_gap_tasks",
        ["task_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(
        op.f("ix_skill_gap_tasks_task_id"),
        table_name="skill_gap_tasks",
    )

    op.drop_index(
        op.f("ix_skill_gap_tasks_skill_gap_id"),
        table_name="skill_gap_tasks",
    )

    op.drop_index(
        op.f("ix_skill_gap_tasks_id"),
        table_name="skill_gap_tasks",
    )

    op.drop_table("skill_gap_tasks")