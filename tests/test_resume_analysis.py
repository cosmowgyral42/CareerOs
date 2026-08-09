def test_resume_analysis_create_requires_auth(client):
    response = client.post(
        "/api/v1/resume-analyses/",
    )

    assert response.status_code == 401