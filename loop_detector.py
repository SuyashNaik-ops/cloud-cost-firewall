import time
from collections import defaultdict, deque


class LoopDetector:
    """Flags agents that send the same prompt too many times in a time window."""

    def __init__(self, max_repeats: int = 5, window_seconds: float = 30):
        if max_repeats < 1:
            raise ValueError("max_repeats must be at least 1.")
        if window_seconds <= 0:
            raise ValueError("window_seconds must be positive.")

        self.max_repeats = max_repeats
        self.window_seconds = window_seconds
        self.requests: defaultdict[tuple[str, str], deque[float]] = defaultdict(deque)

    def check_request(self, agent_id: str, prompt: str) -> dict:
        """
        Record a request and decide whether it is allowed.

        Args:
            agent_id: Identifier of the agent making the request.
            prompt: The prompt text (leading/trailing whitespace is ignored).

        Returns:
            A dict with "allowed", a reason, and the number of identical
            requests seen within the current window (including this one).
        """
        now = time.monotonic()
        key = (agent_id, prompt.strip())

        timestamps = self.requests[key]
        self._prune(timestamps, now)
        timestamps.append(now)

        repeat_count = len(timestamps)

        if repeat_count > self.max_repeats:
            return {
                "allowed": False,
                "reason": (
                    f"Repeated prompt detected: more than "
                    f"{self.max_repeats} requests within "
                    f"{self.window_seconds} seconds."
                ),
                "repeat_count": repeat_count,
            }

        return {
            "allowed": True,
            "reason": "Request frequency is within the limit.",
            "repeat_count": repeat_count,
        }

    def cleanup(self) -> None:
        """Drop keys whose requests have all expired. Call occasionally."""
        now = time.monotonic()
        for key in list(self.requests):
            timestamps = self.requests[key]
            self._prune(timestamps, now)
            if not timestamps:
                del self.requests[key]

    def reset(self) -> None:
        """Forget all recorded requests."""
        self.requests.clear()

    def _prune(self, timestamps: deque, now: float) -> None:
        while timestamps and now - timestamps[0] > self.window_seconds:
            timestamps.popleft()