def test_create_task_requires_auth(client):
    response = client.post(
        "/api/v1/tasks/",
        json={
            "title": "Study FastAPI",
            "description": "Review FastAPI fundamentals",
        },
    )

    assert response.status_code == 401


def test_get_tasks_requires_auth(client):
    response = client.get(
        "/api/v1/tasks/",
    )

    assert response.status_code == 401