def test_get_resources_requires_auth(client):
    response = client.get(
        "/api/v1/resources/",
    )

    assert response.status_code == 401


def test_create_resource_requires_auth(client):
    response = client.post(
        "/api/v1/resources/",
        json={
            "title": "FastAPI Documentation",
            "url": "https://fastapi.tiangolo.com/",
            "description": "FastAPI reference",
        },
    )

    assert response.status_code == 401