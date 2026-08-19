from datetime import date
from uuid import uuid4

import pytest

from app.core.constants import DAILY_AI_USER_LIMIT
from app.core.exceptions import AIDailyQuotaExceededError
from app.models.user import User
from app.repositories import ai_usage_repository
from app.services.ai_usage_service import (
    refund_ai_call,
    require_ai_call,
)


def create_test_user(db_session):
    user = User(
        full_name="AI Usage Test User",
        email=f"ai-usage-{uuid4()}@example.com",
        password_hash="test-password",
        timezone="Asia/Kolkata",
    )

    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    return user


def test_user_can_make_two_ai_calls(db_session):
    user = create_test_user(db_session)
    usage_date = date.today()

    global_usage_before = (
        ai_usage_repository.get_or_create_daily_usage(
            db_session,
            usage_date,
        )
    )

    global_count_before = global_usage_before.total_count

    require_ai_call(
        db_session,
        user.id,
        usage_date,
    )

    require_ai_call(
        db_session,
        user.id,
        usage_date,
    )

    user_usage = ai_usage_repository.get_or_create_user_usage(
        db_session,
        user.id,
        usage_date,
    )

    global_usage_after = (
        ai_usage_repository.get_or_create_daily_usage(
            db_session,
            usage_date,
        )
    )

    assert user_usage.total_count == DAILY_AI_USER_LIMIT

    assert (
        global_usage_after.total_count
        == global_count_before + 2
    )

def test_third_ai_call_is_blocked(db_session):
    user = create_test_user(db_session)
    usage_date = date.today()

    require_ai_call(
        db_session,
        user.id,
        usage_date,
    )

    require_ai_call(
        db_session,
        user.id,
        usage_date,
    )

    with pytest.raises(AIDailyQuotaExceededError):
        require_ai_call(
            db_session,
            user.id,
            usage_date,
        )


def test_refund_restores_user_quota(db_session):
    user = create_test_user(db_session)
    usage_date = date.today()

    global_usage_before = (
        ai_usage_repository.get_or_create_daily_usage(
            db_session,
            usage_date,
        )
    )

    global_count_before = global_usage_before.total_count

    require_ai_call(
        db_session,
        user.id,
        usage_date,
    )

    require_ai_call(
        db_session,
        user.id,
        usage_date,
    )

    global_usage_after_reservation = (
        ai_usage_repository.get_or_create_daily_usage(
            db_session,
            usage_date,
        )
    )

    assert (
        global_usage_after_reservation.total_count
        == global_count_before + 2
    )

    refund_ai_call(
        db_session,
        user.id,
        usage_date,
    )

    user_usage = ai_usage_repository.get_or_create_user_usage(
        db_session,
        user.id,
        usage_date,
    )

    global_usage_after_refund = (
        ai_usage_repository.get_or_create_daily_usage(
            db_session,
            usage_date,
        )
    )

    assert user_usage.total_count == 1

    assert (
        global_usage_after_refund.total_count
        == global_count_before + 1
    )

def test_different_features_share_same_user_quota(db_session):
    user = create_test_user(db_session)
    usage_date = date.today()

    # Resume Analyzer uses call #1.
    require_ai_call(
        db_session,
        user.id,
        usage_date,
    )

    # Career Fit uses call #2.
    require_ai_call(
        db_session,
        user.id,
        usage_date,
    )

    # Any third AI feature must be blocked.
    with pytest.raises(AIDailyQuotaExceededError):
        require_ai_call(
            db_session,
            user.id,
            usage_date,
        )