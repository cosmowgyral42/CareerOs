from io import BytesIO
from pathlib import Path

from docx import Document
from pypdf import PdfReader


ALLOWED_EXTENSIONS = {".pdf", ".docx"}
MAX_FILE_SIZE = 5 * 1024 * 1024


def validate_resume_file(
    filename: str | None,
    content: bytes,
) -> str:
    if not filename:
        raise ValueError("File name is required")

    extension = Path(filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise ValueError("Only PDF and DOCX files are supported")

    if not content:
        raise ValueError("Uploaded file is empty")

    if len(content) > MAX_FILE_SIZE:
        raise ValueError("Resume must be 5 MB or smaller")

    return extension


def extract_pdf_text(content: bytes) -> str:
    reader = PdfReader(BytesIO(content))

    return "\n".join(
        page.extract_text() or ""
        for page in reader.pages
    ).strip()


def extract_docx_text(content: bytes) -> str:
    document = Document(BytesIO(content))

    return "\n".join(
        paragraph.text
        for paragraph in document.paragraphs
    ).strip()


def extract_resume_text(
    filename: str | None,
    content: bytes,
) -> str:
    extension = validate_resume_file(filename, content)

    try:
        if extension == ".pdf":
            text = extract_pdf_text(content)
        else:
            text = extract_docx_text(content)

    except Exception as exc:
        raise ValueError(
            "Could not read the uploaded resume"
        ) from exc

    if not text:
        raise ValueError(
            "No readable text was found in the resume"
        )

    return text