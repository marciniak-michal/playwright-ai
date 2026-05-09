---
name: create-pr
description: Opens Pull Request on GitHub.
agent: agent
model: GPT-5 mini (copilot)
---

When creating a new Pull Request, follow these steps with the help of Github MCP Server:

1. Create a new branch with a name based on the recent changes.
2. If any new tests were added or existing tests were updated, ensure that the TEST_PLAN.md file is updated accordingly using the 'sync-test-plan' prompt.
3. Commit the changes to the new branch and push them to the remote repository.
4. Create a clear and concise title and description for the Pull Request with the help of 'pr-title-description' prompt.
5. Open a Pull Request on GitHub.