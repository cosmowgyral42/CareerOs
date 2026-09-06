"""add skill gap project relationships

Revision ID: 592a8b82608c
Revises: 5fed469d2b4f
Create Date: 2026-09-05 11:18:57.526176

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '592a8b82608c'
down_revision: Union[str, Sequence[str], None] = '5fed469d2b4f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "skill_gap_projects",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("skill_gap_id", sa.Integer(), nullable=False),
        sa.Column("project_id", sa.Integer(), nullable=False),
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
            ["project_id"],
            ["projects.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "skill_gap_id",
            "project_id",
            name="uq_skill_gap_projects_gap_project",
        ),
    )

    op.create_index(
        op.f("ix_skill_gap_projects_id"),
        "skill_gap_projects",
        ["id"],
        unique=False,
    )

    op.create_index(
        op.f("ix_skill_gap_projects_skill_gap_id"),
        "skill_gap_projects",
        ["skill_gap_id"],
        unique=False,
    )

    op.create_index(
        op.f("ix_skill_gap_projects_project_id"),
        "skill_gap_projects",
        ["project_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(
        op.f("ix_skill_gap_projects_project_id"),
        table_name="skill_gap_projects",
    )

    op.drop_index(
        op.f("ix_skill_gap_projects_skill_gap_id"),
        table_name="skill_gap_projects",
    )

    op.drop_index(
        op.f("ix_skill_gap_projects_id"),
        table_name="skill_gap_projects",
    )

    op.drop_table("skill_gap_projects")
