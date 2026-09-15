def test_invalid_token_is_rejected(
    client,
):
    response = client.get(
        "/api/v1/users/me",
        headers={
            "Authorization":
                "Bearer invalid-token",
        },
    )

    print(response.status_code)
    print(response.json())

    assert response.status_code == 401