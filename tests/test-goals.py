def test_create_goal_requires_auth(client):
    response = client.post(
        "/api/v1/goals/",
        json={
            "title": "Learn Python",
            "description": "Complete Python fundamentals",
        },
    )

    assert response.status_code == 401


def test_get_goals_requires_auth(client):
    response = client.get("/api/v1/goals/")

    assert response.status_code == 401