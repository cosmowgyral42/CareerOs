def test_register_login_and_get_current_user(
    client,
    test_user,
):
    register_response = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": test_user["full_name"],
            "email": test_user["email"],
            "password": test_user["password"],
            "timezone": test_user["timezone"],
        },
    )

    assert register_response.status_code == 201

    registered_user = register_response.json()

    assert registered_user["email"] == test_user["email"]
    assert (
        registered_user["full_name"]
        == test_user["full_name"]
    )

    login_response = client.post(
        "/api/v1/auth/login",
        data={
            "username": test_user["email"],
            "password": test_user["password"],
        },
    )

    assert login_response.status_code == 200

    token_data = login_response.json()

    assert "access_token" in token_data
    assert token_data["access_token"]

    access_token = token_data["access_token"]

    profile_response = client.get(
        "/api/v1/users/me",
        headers={
            "Authorization":
                f"Bearer {access_token}",
        },
    )

    assert profile_response.status_code == 200

    profile = profile_response.json()

    assert profile["email"] == test_user["email"]
    assert (
        profile["full_name"]
        == test_user["full_name"]
    )


def test_protected_endpoint_requires_token(
    client,
):
    response = client.get(
        "/api/v1/users/me",
    )

    assert response.status_code == 401


def test_invalid_login_returns_401(
    client,
):
    response = client.post(
        "/api/v1/auth/login",
        data={
            "username":
                "missing@example.com",
            "password":
                "WrongPassword123!",
        },
    )

    assert response.status_code == 401