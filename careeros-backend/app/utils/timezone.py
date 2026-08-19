from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo


def validate_timezone(value: str) -> str:
    try:
        ZoneInfo(value)
    except Exception:
        raise ValueError("Invalid timezone")

    return value


def get_user_day_range_utc(user_timezone: str):
    tz = ZoneInfo(user_timezone)

    now_local = datetime.now(tz)

    start_local = now_local.replace(
        hour=0,
        minute=0,
        second=0,
        microsecond=0,
    )

    end_local = start_local + timedelta(days=1)

    start_utc = start_local.astimezone(timezone.utc)
    end_utc = end_local.astimezone(timezone.utc)

    return start_utc, end_utc