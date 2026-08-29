import json

from openai import (
    APIConnectionError,
    APIStatusError,
    APITimeoutError,
    OpenAI,
    RateLimitError,
)

from app.core.config import settings
from app.core.exceptions import AIProviderUnavailableError


class OpenRouterProvider:
    def __init__(self) -> None:
        if not settings.openrouter_api_key:
            raise AIProviderUnavailableError(
                "AI service is not configured"
            )

        self.client = OpenAI(
            api_key=settings.openrouter_api_key,
            base_url="https://openrouter.ai/api/v1",
            timeout=30.0,
        )

    def generate_json(
        self,
        *,
        system_prompt: str,
        user_prompt: str,
    ) -> dict:
        try:
            response = self.client.chat.completions.create(
                model=settings.openrouter_model,
                messages=[
                    {
                        "role": "system",
                        "content": system_prompt,
                    },
                    {
                        "role": "user",
                        "content": user_prompt,
                    },
                ],
                temperature=0.2,
            )

        except RateLimitError as exc:
            raise AIProviderUnavailableError(
                "Free AI capacity is temporarily unavailable. "
                "Please try again later."
            ) from exc

        except APIConnectionError as exc:
            raise AIProviderUnavailableError(
                "Could not connect to the AI provider."
            ) from exc

        except APITimeoutError as exc:
            raise AIProviderUnavailableError(
                "The AI provider took too long to respond."
            ) from exc

        except APIStatusError as exc:
            raise AIProviderUnavailableError(
                f"AI provider request failed with "
                f"status {exc.status_code}."
            ) from exc

        except Exception as exc:
            raise AIProviderUnavailableError(
                "Unexpected AI provider error."
            ) from exc

        if not response.choices:
            raise AIProviderUnavailableError(
                "AI returned no response choices."
            )

        message = response.choices[0].message

        content = message.content

        if not content:
            raise AIProviderUnavailableError(
                "AI returned an empty response."
            )

        content = content.strip()

        # Some models wrap JSON inside Markdown fences.
        if content.startswith("```"):
            lines = content.splitlines()

            if lines and lines[0].startswith("```"):
                lines = lines[1:]

            if lines and lines[-1].strip() == "```":
                lines = lines[:-1]

            content = "\n".join(lines).strip()

        try:
            data = json.loads(content)

        except json.JSONDecodeError as exc:
            raise AIProviderUnavailableError(
                "AI returned a response that was not valid JSON."
            ) from exc

        if not isinstance(data, dict):
            raise AIProviderUnavailableError(
                "AI returned an invalid response format."
            )

        return data