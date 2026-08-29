from app.core.config import settings
from app.services.ai_provider import OpenRouterProvider


def main() -> None:
    print("Testing CareerOS AI provider...")
    print(f"Model: {settings.openrouter_model}")

    provider = OpenRouterProvider()

    result = provider.generate_json(
        system_prompt="""
You are a test assistant.

Return ONLY valid JSON.

Do not use Markdown.
Do not use code fences.
Do not add explanations.
""",
        user_prompt="""
Return exactly this JSON object:

{
  "message": "CareerOS AI works"
}
""",
    )

    print("SUCCESS")
    print(result)


if __name__ == "__main__":
    main()