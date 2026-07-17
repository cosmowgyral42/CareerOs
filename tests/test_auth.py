def test_register_user(client, test_user):
    response = client.post(
        "/api/v1/auth/register",
        json=test_user,
    )

    assert response.status_code == 201

    data = response.json()

    assert data["email"] == test_user["email"]
    assert "password" not in data
    assert "password_hash" not in data

def test_duplicate_registration(client, test_user):
    client.post("/api/v1/auth/register", json=test_user)

    response = client.post(
        "/api/v1/auth/register",
        json=test_user,
    )

    assert response.status_code == 409

def test_login(client, test_user):
    client.post("/api/v1/auth/register", json=test_user)

    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": test_user["email"],
            "password": test_user["password"],
        },
    )

    assert response.status_code == 200
    assert "access_token" in response.json()


def test_wrong_password(client, test_user):
    client.post("/api/v1/auth/register", json=test_user)

    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": test_user["email"],
            "password": "WrongPassword123!",
        },
    )

    assert response.status_code == 401

def test_users_me(client, test_user):
    client.post("/api/v1/auth/register", json=test_user)

    login_response = client.post(
        "/api/v1/auth/login",
        json={
            "email": test_user["email"],
            "password": test_user["password"],
        },
    )

    token = login_response.json()["access_token"]

    response = client.get(
        "/api/v1/users/me",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200
    assert response.json()["email"] == test_user["email"]

def test_invalid_token(client):
    response = client.get(
        "/api/v1/users/me",
        headers={"Authorization": "Bearer invalid-token"},
    )

    assert response.status_code == 401


def test_missing_token(client):
    response = client.get("/api/v1/users/me")

    assert response.status_code == 401