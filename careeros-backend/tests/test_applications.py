def test_create_application_requires_auth(client):
    response = client.post(
        "/api/v1/applications/",
        json={
            "company": "Example Company",
            "position": "Backend Intern",
        },
    )

    assert response.status_code == 401


def test_get_applications_requires_auth(client):
    response = client.get(
        "/api/v1/applications/",
    )

    assert response.status_code == 401