import json

from openai import (
    APIConnectionError,
    APIStatusError,
    APITimeoutError,
    OpenAI,
    RateLimitError,
)
from pydantic import ValidationError

from app.core.config import settings
from app.core.exceptions import AIProviderUnavailableError
from app.schemas.resume_analysis import AIResumeResult
from app.core.logger import logger

SYSTEM_PROMPT = """
You are CareerOS Resume Analyzer.

Analyze the resume only against the provided job description.

Return ONLY valid JSON with these exact fields:
{
  "match_score": 0,
  "matched_skills": [],
  "missing_skills": [],
  "strengths": [],
  "weaknesses": [],
  "recommendations": [],
  "summary": ""
}

Rules:
- match_score must be an integer from 0 to 100.
- Never invent skills, experience, education, or achievements.
- Base conclusions only on the supplied resume and job description.
- Give specific and practical recommendations.
"""


def analyze_resume(
    resume_text: str,
    job_description: str,
) -> AIResumeResult:
    if not settings.openrouter_api_key:
        raise AIProviderUnavailableError(
            "AI service is not configured"
        )
    logger.info("Initializing AI provider")
    client = OpenAI(
        api_key=settings.openrouter_api_key,
        base_url="https://openrouter.ai/api/v1",
        timeout=30.0,
    )

    try:
        logger.info("Sending resume analysis request to AI provider")
        response = client.chat.completions.create(
            model=settings.openrouter_model,
            messages=[
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT,
                },
                {
                    "role": "user",
                    "content": (
                        f"RESUME:\n{resume_text}\n\n"
                        f"JOB DESCRIPTION:\n{job_description}"
                    ),
                },
            ],
            temperature=0.2,
        )

    except RateLimitError as exc:
        raise AIProviderUnavailableError(
            "Free AI capacity is temporarily unavailable"
        ) from exc

    except (APIConnectionError, APITimeoutError) as exc:
        raise AIProviderUnavailableError(
            "AI provider is temporarily unavailable"
        ) from exc

    except APIStatusError as exc:
        raise AIProviderUnavailableError(
            "AI provider could not process the request"
        ) from exc

    content = response.choices[0].message.content

    if not content:
        raise AIProviderUnavailableError(
            "AI returned an empty response"
        )

    try:
        data = json.loads(content)
        result = AIResumeResult.model_validate(data)

        logger.info("AI resume analysis completed successfully")

        return result

    except (json.JSONDecodeError, ValidationError) as exc:
        raise AIProviderUnavailableError(
            "AI returned an invalid response"
        ) from exc