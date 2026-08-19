from fastapi import APIRouter, HTTPException, Response, status

from app.api.deps import CurrentUser, DatabaseSession
from app.schemas.goal import GoalCreate, GoalResponse, GoalUpdate
from app.services import goal_service


router = APIRouter(prefix="/goals", tags=["Goals"])


@router.post(
    "",
    response_model=GoalResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_goal(
    goal_data: GoalCreate,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    return goal_service.create_goal(db, current_user.id, goal_data)


@router.get("", response_model=list[GoalResponse])
def get_goals(
    db: DatabaseSession,
    current_user: CurrentUser,
):
    return goal_service.get_user_goals(db, current_user.id)


@router.get("/{goal_id}", response_model=GoalResponse)
def get_goal(
    goal_id: int,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    goal = goal_service.get_goal(db, goal_id, current_user.id)

    if goal is None:
        raise HTTPException(status_code=404, detail="Goal not found")

    return goal


@router.patch("/{goal_id}", response_model=GoalResponse)
def update_goal(
    goal_id: int,
    goal_data: GoalUpdate,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    goal = goal_service.get_goal(db, goal_id, current_user.id)

    if goal is None:
        raise HTTPException(status_code=404, detail="Goal not found")

    return goal_service.update_goal(db, goal, goal_data)


@router.delete(
    "/{goal_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_goal(
    goal_id: int,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    goal = goal_service.get_goal(db, goal_id, current_user.id)

    if goal is None:
        raise HTTPException(status_code=404, detail="Goal not found")

    goal_service.delete_goal(db, goal)

    return Response(status_code=status.HTTP_204_NO_CONTENT)