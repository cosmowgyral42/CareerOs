"""add skill gap identity constraint

Revision ID: c4d8e2f1a9b7
Revises: 5982489ebd03
Create Date: 2026-09-03

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "c4d8e2f1a9b7"
down_revision: Union[str, Sequence[str], None] = "5982489ebd03"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    connection = op.get_bind()
    duplicate = connection.execute(
        sa.text(
            """
            SELECT user_id, career_target_id, skill_id
            FROM skill_gaps
            GROUP BY user_id, career_target_id, skill_id
            HAVING COUNT(*) > 1
            LIMIT 1
            """
        )
    ).first()

    if duplicate is not None:
        raise RuntimeError(
            "Cannot add uq_skill_gaps_user_target_skill because "
            "duplicate SkillGap identities exist. Resolve duplicate "
            "(user_id, career_target_id, skill_id) records manually "
            "before rerunning this migration."
        )

    with op.batch_alter_table("skill_gaps") as batch_op:
        batch_op.create_unique_constraint(
            "uq_skill_gaps_user_target_skill",
            ["user_id", "career_target_id", "skill_id"],
        )


def downgrade() -> None:
    with op.batch_alter_table("skill_gaps") as batch_op:
        batch_op.drop_constraint(
            "uq_skill_gaps_user_target_skill",
            type_="unique",
        )
