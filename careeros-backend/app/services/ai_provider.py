import json
import re

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
                "AI service is not configured."
            )

        self.client = OpenAI(
            api_key=settings.openrouter_api_key,
            base_url="https://openrouter.ai/api/v1",
            timeout=60.0,
        )

    def generate_json(
        self,
        *,
        system_prompt: str,
        user_prompt: str,
    ) -> dict:
        try:
            response = (
                self.client.chat.completions.create(
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
            )

        except RateLimitError as exc:
            raise AIProviderUnavailableError(
                "The free AI service is temporarily "
                "rate-limited. Please try again later."
            ) from exc

        except APITimeoutError as exc:
            raise AIProviderUnavailableError(
                "The AI provider took too long to respond. "
                "Please try again."
            ) from exc

        except APIConnectionError as exc:
            raise AIProviderUnavailableError(
                "Could not connect to the AI provider. "
                "Please check your connection and try again."
            ) from exc

        except APIStatusError as exc:
            status_code = exc.status_code

            if status_code == 503:
                raise AIProviderUnavailableError(
                    "Free AI capacity is temporarily "
                    "unavailable. Please try again later."
                ) from exc

            raise AIProviderUnavailableError(
                "AI provider request failed with "
                f"status {status_code}."
            ) from exc

        except Exception as exc:
            raise AIProviderUnavailableError(
                "Unexpected AI provider error."
            ) from exc

        if not response.choices:
            raise AIProviderUnavailableError(
                "AI returned no response choices."
            )

        content = (
            response.choices[0]
            .message
            .content
        )

        if not content:
            raise AIProviderUnavailableError(
                "AI returned an empty response."
            )

        data = self._parse_json(
            content.strip(),
        )

        if not isinstance(data, dict):
            raise AIProviderUnavailableError(
                "AI returned an invalid response format."
            )

        return data

    @staticmethod
    def _parse_json(content: str) -> dict:
        """
        Extract JSON safely from responses that may contain
        Markdown fences or small amounts of extra text.
        """

        cleaned = content.strip()

        if cleaned.startswith("```"):
            cleaned = re.sub(
                r"^```(?:json)?\s*",
                "",
                cleaned,
                flags=re.IGNORECASE,
            )

            cleaned = re.sub(
                r"\s*```$",
                "",
                cleaned,
            )

            cleaned = cleaned.strip()

        try:
            return json.loads(cleaned)

        except json.JSONDecodeError:
            pass

        start = cleaned.find("{")
        end = cleaned.rfind("}")

        if start == -1 or end == -1 or end <= start:
            raise AIProviderUnavailableError(
                "AI returned a response that was not valid JSON."
            )

        json_content = cleaned[start:end + 1]

        try:
            return json.loads(json_content)

        except json.JSONDecodeError as exc:
            raise AIProviderUnavailableError(
                "AI returned a response that was not valid JSON."
            ) from exc