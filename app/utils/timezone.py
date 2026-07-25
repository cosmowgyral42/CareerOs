from zoneinfo import ZoneInfo


def validate_timezone(value: str) -> str:
    try:
        ZoneInfo(value)
    except Exception:
        raise ValueError("Invalid timezone")

    return value