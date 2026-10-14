# Demo pricing assumptions only, not verified live pricing.
# Replace these rates with the selected model's current pricing
# before presenting cost estimates as real-world figures.
INPUT_RATE_PER_MILLION = 0.30   # USD per 1M input tokens
OUTPUT_RATE_PER_MILLION = 2.50  # USD per 1M output tokens


def estimate_cost(input_tokens: int, output_tokens: int) -> float:
    """
    Estimate Gemini API cost in USD.

    Args:
        input_tokens: Number of input (prompt) tokens.
        output_tokens: Number of output (completion) tokens.

    Returns:
        Estimated cost in USD, rounded to 8 decimal places.

    Raises:
        ValueError: If either token count is negative.
    """
    if input_tokens < 0 or output_tokens < 0:
        raise ValueError("Token counts must be non-negative.")

    input_cost = (input_tokens / 1_000_000) * INPUT_RATE_PER_MILLION
    output_cost = (output_tokens / 1_000_000) * OUTPUT_RATE_PER_MILLION

    return round(input_cost + output_cost, 8)