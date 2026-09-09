from app.services.resume_analysis_service import (
    MAX_RESUME_SIZE,
    create_resume_analysis,
)


def test_resume_analysis_create_requires_auth(client):
    response = client.post(
        "/api/v1/resume-analyses/",
    )

    assert response.status_code == 401


def test_resume_file_rejects_oversized_file(db_session):
    oversized_content = b"A" * (MAX_RESUME_SIZE + 1)

    try:
        create_resume_analysis(
            db_session,
            user_id=1,
            filename="resume.pdf",
            content=oversized_content,
            job_description="A valid job description " * 10,
        )
    except ValueError as exc:
        assert str(exc) == "Resume file must be 5 MB or smaller."
    else:
        raise AssertionError(
            "Oversized resume should have been rejected."
        )


def test_resume_file_rejects_unsupported_extension(db_session):
    try:
        create_resume_analysis(
            db_session,
            user_id=1,
            filename="resume.exe",
            content=b"malicious-content",
            job_description="A valid job description " * 10,
        )
    except ValueError as exc:
        assert "Only PDF and DOCX files are allowed." in str(exc)
    else:
        raise AssertionError(
            "Unsupported resume format should have been rejected."
        )


def test_resume_file_rejects_invalid_pdf_signature(db_session):
    try:
        create_resume_analysis(
            db_session,
            user_id=1,
            filename="resume.pdf",
            content=b"not-a-real-pdf",
            job_description="A valid job description " * 10,
        )
    except ValueError as exc:
        assert (
            "The uploaded file is not a valid PDF."
            in str(exc)
        )
    else:
        raise AssertionError(
            "Invalid PDF should have been rejected."
        )