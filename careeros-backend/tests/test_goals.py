import uuid


def register_user_and_get_token(
    client,
    *,
    full_name,
    email,
    password,
    timezone="Asia/Kolkata",
):
    register_response = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": full_name,
            "email": email,
            "password": password,
            "timezone": timezone,
        },
    )

    assert register_response.status_code == 201

    login_response = client.post(
        "/api/v1/auth/login",
        data={
            "username": email,
            "password": password,
        },
    )

    assert login_response.status_code == 200

    token_data = login_response.json()

    assert "access_token" in token_data
    assert token_data["access_token"]

    return token_data["access_token"]


def create_authenticated_user(client):
    unique_id = uuid.uuid4()

    email = (
        f"goal-user-{unique_id}@example.com"
    )

    password = "TestPassword123!"

    token = register_user_and_get_token(
        client,
        full_name="Goal Test User",
        email=email,
        password=password,
    )

    return {
        "email": email,
        "password": password,
        "token": token,
        "headers": {
            "Authorization": f"Bearer {token}",
        },
    }


def test_create_goal_requires_auth(client):
    response = client.post(
        "/api/v1/goals/",
        json={
            "title": "Learn Python",
            "description":
                "Complete Python fundamentals",
        },
    )

    assert response.status_code == 401


def test_get_goals_requires_auth(client):
    response = client.get(
        "/api/v1/goals/",
    )

    assert response.status_code == 401


def test_create_goal_successfully(client):
    user = create_authenticated_user(client)

    response = client.post(
        "/api/v1/goals/",
        headers=user["headers"],
        json={
            "title": "Learn FastAPI",
            "description":
                "Build production APIs",
            "target_date": "2026-12-31",
        },
    )

    assert response.status_code == 201

    goal = response.json()

    assert goal["id"]
    assert goal["title"] == "Learn FastAPI"

    assert (
        goal["description"]
        == "Build production APIs"
    )

    assert (
        goal["target_date"]
        == "2026-12-31"
    )

    assert goal["status"] == "active"


def test_get_goals_successfully(client):
    user = create_authenticated_user(client)

    create_response = client.post(
        "/api/v1/goals/",
        headers=user["headers"],
        json={
            "title": "Learn PostgreSQL",
            "description":
                "Understand relational databases",
        },
    )

    assert create_response.status_code == 201

    response = client.get(
        "/api/v1/goals/",
        headers=user["headers"],
    )

    assert response.status_code == 200

    goals = response.json()

    assert isinstance(goals, list)
    assert len(goals) >= 1

    assert any(
        goal["title"] == "Learn PostgreSQL"
        for goal in goals
    )


def test_update_own_goal_successfully(client):
    user = create_authenticated_user(client)

    create_response = client.post(
        "/api/v1/goals/",
        headers=user["headers"],
        json={
            "title": "Initial Goal",
            "description":
                "Initial description",
        },
    )

    assert create_response.status_code == 201

    created_goal = create_response.json()

    response = client.patch(
        f"/api/v1/goals/{created_goal['id']}",
        headers=user["headers"],
        json={
            "title": "Updated Goal",
            "status": "completed",
            "target_date": "2026-11-30",
        },
    )

    assert response.status_code == 200

    updated_goal = response.json()

    assert (
        updated_goal["id"]
        == created_goal["id"]
    )

    assert (
        updated_goal["title"]
        == "Updated Goal"
    )

    assert (
        updated_goal["status"]
        == "completed"
    )

    assert (
        updated_goal["target_date"]
        == "2026-11-30"
    )


def test_delete_own_goal_successfully(client):
    user = create_authenticated_user(client)

    create_response = client.post(
        "/api/v1/goals/",
        headers=user["headers"],
        json={
            "title": "Goal To Delete",
        },
    )

    assert create_response.status_code == 201

    created_goal = create_response.json()

    delete_response = client.delete(
        f"/api/v1/goals/{created_goal['id']}",
        headers=user["headers"],
    )

    assert delete_response.status_code in (
        200,
        204,
    )

    get_response = client.get(
        "/api/v1/goals/",
        headers=user["headers"],
    )

    assert get_response.status_code == 200

    goals = get_response.json()

    assert not any(
        goal["id"] == created_goal["id"]
        for goal in goals
    )


def test_cannot_update_another_users_goal(client):
    owner = create_authenticated_user(client)

    other_user = create_authenticated_user(client)

    create_response = client.post(
        "/api/v1/goals/",
        headers=owner["headers"],
        json={
            "title": "Private Goal",
        },
    )

    assert create_response.status_code == 201

    goal = create_response.json()

    response = client.patch(
        f"/api/v1/goals/{goal['id']}",
        headers=other_user["headers"],
        json={
            "title": "Hacked Goal",
        },
    )

    assert response.status_code in (
        403,
        404,
    )


def test_cannot_delete_another_users_goal(client):
    owner = create_authenticated_user(client)

    other_user = create_authenticated_user(client)

    create_response = client.post(
        "/api/v1/goals/",
        headers=owner["headers"],
        json={
            "title": "Owner Goal",
        },
    )

    assert create_response.status_code == 201

    goal = create_response.json()

    response = client.delete(
        f"/api/v1/goals/{goal['id']}",
        headers=other_user["headers"],
    )

    assert response.status_code in (
        403,
        404,
    )


def test_create_goal_validation_error_for_empty_title(
    client,
):
    user = create_authenticated_user(client)

    response = client.post(
        "/api/v1/goals/",
        headers=user["headers"],
        json={
            "title": "",
        },
    )

    assert response.status_code == 422


def test_create_goal_validation_error_for_long_title(
    client,
):
    user = create_authenticated_user(client)

    response = client.post(
        "/api/v1/goals/",
        headers=user["headers"],
        json={
            "title": "A" * 201,
        },
    )

    assert response.status_code == 422