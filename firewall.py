from cost_calculator import estimate_cost


class BudgetFirewall:
    """Blocks requests that would push total estimated spend over a budget."""

    def __init__(self, budget_usd: float):
        if budget_usd < 0:
            raise ValueError("Budget cannot be negative.")

        self.budget_usd = budget_usd
        self.spent_usd = 0.0
        self.blocked_requests = 0

    @property
    def remaining_usd(self) -> float:
        """Budget left, rounded to 8 decimal places."""
        return round(self.budget_usd - self.spent_usd, 8)

    def check_request(self, input_tokens: int, output_tokens: int) -> dict:
        """
        Approve or block a request based on its estimated cost.

        Args:
            input_tokens: Number of input (prompt) tokens.
            output_tokens: Number of expected output (completion) tokens.

        Returns:
            A dict with the decision ("approved"), a reason, the estimated
            cost of this request, total spent so far, and the budget.

        Raises:
            ValueError: If either token count is negative (from estimate_cost).
        """
        estimated_cost = estimate_cost(input_tokens, output_tokens)

        if self.spent_usd + estimated_cost > self.budget_usd:
            self.blocked_requests += 1
            return self._result(False, "Budget limit would be exceeded.", estimated_cost)

        self.spent_usd += estimated_cost
        return self._result(True, "Request approved.", estimated_cost)

    def reset(self) -> None:
        """Clear spend and blocked-request counters."""
        self.spent_usd = 0.0
        self.blocked_requests = 0

    def _result(self, approved: bool, reason: str, estimated_cost: float) -> dict:
        return {
            "approved": approved,
            "reason": reason,
            "estimated_cost_usd": estimated_cost,
            "spent_usd": round(self.spent_usd, 8),
            "budget_usd": self.budget_usd,
        }