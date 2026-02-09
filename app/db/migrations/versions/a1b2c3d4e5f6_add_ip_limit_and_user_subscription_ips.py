"""add ip_limit and user_subscription_ips

Revision ID: a1b2c3d4e5f6
Revises: 54c4b8c525fc
Create Date: 2025-02-03

"""
from alembic import op
import sqlalchemy as sa


revision = 'a1b2c3d4e5f6'
down_revision = '2b231de97dc3'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('users', sa.Column('ip_limit', sa.Integer(), nullable=True))
    op.create_table(
        'user_subscription_ips',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('ip', sa.String(45), nullable=False),
        sa.Column('last_seen', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id', 'ip', name='uq_user_subscription_ip_user_ip'),
    )
    op.create_index(op.f('ix_user_subscription_ips_user_id'), 'user_subscription_ips', ['user_id'], unique=False)
    op.create_index(op.f('ix_user_subscription_ips_ip'), 'user_subscription_ips', ['ip'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_user_subscription_ips_ip'), table_name='user_subscription_ips')
    op.drop_index(op.f('ix_user_subscription_ips_user_id'), table_name='user_subscription_ips')
    op.drop_table('user_subscription_ips')
    op.drop_column('users', 'ip_limit')
