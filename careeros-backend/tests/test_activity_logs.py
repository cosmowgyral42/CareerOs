def test_get_activity_logs(client, test_user):
    client.post(
        "/api/v1/auth/register",
        json=test_user,
    )

    login_response = client.post(
        "/api/v1/auth/login",
        data={
            "username": test_user["email"],
            "password": test_user["password"],
        },
    )

    token = login_response.json()["access_token"]

    response = client.get(
        "/api/v1/activity-logs",
        headers={
            "Authorization": f"Bearer {token}",
        },
    )

    assert response.status_code == 200

    logs = response.json()

    assert isinstance(logs, list)
    assert len(logs) >= 2

    actions = [log["action"] for log in logs]

    assert "register" in actions
    assert "login" in actions


def test_get_recent_activity_logs(client, test_user):
    client.post(
        "/api/v1/auth/register",
        json=test_user,
    )

    login_response = client.post(
        "/api/v1/auth/login",
        data={
            "username": test_user["email"],
            "password": test_user["password"],
        },
    )

    token = login_response.json()["access_token"]

    response = client.get(
        "/api/v1/activity-logs/recent",
        headers={
            "Authorization": f"Bearer {token}",
        },
    )

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_activity_logs_requires_auth(client):
    response = client.get("/api/v1/activity-logs")

    assert response.status_code == 401