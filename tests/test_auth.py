from fastapi import status


def test_register_user(client, test_user):
    response = client.post(
        "/api/v1/auth/register",
        json=test_user,
    )

    assert response.status_code == status.HTTP_201_CREATED

    data = response.json()

    assert data["email"] == test_user["email"]
    assert data["full_name"] == test_user["full_name"]
    assert data["timezone"] == test_user["timezone"]


def test_duplicate_registration(client, test_user):
    first_response = client.post(
        "/api/v1/auth/register",
        json=test_user,
    )

    assert first_response.status_code == status.HTTP_201_CREATED

    second_response = client.post(
        "/api/v1/auth/register",
        json=test_user,
    )

    assert second_response.status_code == status.HTTP_409_CONFLICT

    data = second_response.json()

    assert data["error"]["message"] == "Email is already registered"


def test_login(client, test_user):
    register_response = client.post(
        "/api/v1/auth/register",
        json=test_user,
    )

    assert register_response.status_code == status.HTTP_201_CREATED

    response = client.post(
        "/api/v1/auth/login",
        data={
            "username": test_user["email"],
            "password": test_user["password"],
        },
    )

    assert response.status_code == status.HTTP_200_OK

    data = response.json()

    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_wrong_password(client, test_user):
    register_response = client.post(
        "/api/v1/auth/register",
        json=test_user,
    )

    assert register_response.status_code == status.HTTP_201_CREATED

    response = client.post(
        "/api/v1/auth/login",
        data={
            "username": test_user["email"],
            "password": "WrongPassword123!",
        },
    )

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_users_me(client, test_user):
    register_response = client.post(
        "/api/v1/auth/register",
        json=test_user,
    )

    assert register_response.status_code == status.HTTP_201_CREATED

    login_response = client.post(
        "/api/v1/auth/login",
        data={
            "username": test_user["email"],
            "password": test_user["password"],
        },
    )

    assert login_response.status_code == status.HTTP_200_OK

    token = login_response.json()["access_token"]

    response = client.get(
        "/api/v1/users/me",
        headers={
            "Authorization": f"Bearer {token}",
        },
    )

    assert response.status_code == status.HTTP_200_OK

    data = response.json()

    assert data["email"] == test_user["email"]
    assert data["timezone"] == test_user["timezone"]


def test_invalid_token(client):
    response = client.get(
        "/api/v1/users/me",
        headers={
            "Authorization": "Bearer invalid-token",
        },
    )

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_missing_token(client):
    response = client.get(
        "/api/v1/users/me",
    )

    assert response.status_code == status.HTTP_401_UNAUTHORIZED