def test_create_project_requires_auth(client):
    response = client.post(
        "/api/v1/projects/",
        json={
            "name": "CareerOS",
            "description": "AI-powered career platform",
        },
    )

    assert response.status_code == 401


def test_get_projects_requires_auth(client):
    response = client.get(
        "/api/v1/projects/",
    )

    assert response.status_code == 401