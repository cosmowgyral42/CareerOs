from datetime import datetime, timezone
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user import User

def get_by_id(db: Session, user_id: int) -> User | None:
    statement = select(User).where(User.id == user_id)

    return db.scalar(statement)

def get_by_email(db: Session, email: str) -> User | None:
    statement = select(User).where(User.email == email)

    return db.scalar(statement)

def create(
    db: Session,
    *,
    full_name: str,
    email: str,
    password_hash: str,
) -> User:
    user = User(
        full_name=full_name,
        email=email,
        password_hash=password_hash,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user

def update_last_login(db: Session, user: User) -> User:
    user.last_login_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(user)

    return user