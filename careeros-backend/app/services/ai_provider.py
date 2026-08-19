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
            return json.loads(content)
        except json.JSONDecodeError as exc:
            raise AIProviderUnavailableError(
                "AI returned an invalid response"
            ) from exc