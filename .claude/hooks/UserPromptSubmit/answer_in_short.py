#!/usr/bin/env python3
"""Append an instruction to answer in short when the prompt ends with -a."""

import json
import sys


def main() -> None:
    try:
        data = json.load(sys.stdin)
        prompt = data.get("prompt", "")
        if prompt.rstrip().endswith("-a"):
            print("\nANSWER IN SHORT.")
        sys.exit(0)
    except Exception as e:  # pragma: no cover
        print(f"answer_in_short error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
