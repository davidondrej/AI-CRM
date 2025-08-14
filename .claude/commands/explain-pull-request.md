Explain this Pull Request: $ARGUMENTS.

**GOAL:** Review a Pull Request from a developer on our team. Spot logic flaws, architectural issues, SOLID violations, bad edge cases, potential bugs, etc. Focus on the 80-20, don't overthink it. Review quickly yet thoroughly.

**RED FLAGS TO WATCH FOR:**
- Files growing beyond 300 LOC
- Adding methods to existing classes
- Modifying working code instead of extending
- Fat interfaces/components doing too much
- major edge cases
- serious logic flaws

----

EXECUTE ALL OF THESE STEPS IN ORDER:

**STEP 01: Understand the PR**
1. Run `gh pr view` to get the PR details
2. Run `gh pr diff` to get the diff of the PR
3. Explain to the user what the PR is about, in short sentences
4. Proceed to STEP 02 right away

**STEP 02: Pull the PR branch**
1. Run `gh pr checkout <PR_NUMBER>` to pull the PR branch (run 'git fetch' if you run into issues)
2. Proceed to STEP 03 right away

**STEP 03: Manual in-app testing**
1. in a very short bullet list, tell the user how to manually test the PR changes
2. Assume he already has frontend & backend running locally
3. Give the user the 80-20 testing instructions (super short steps)
4. STOP. Wait for user input.

Remember:
- DO NOT BEGIN UNTIL THE USER GIVES YOU THE PULL REQUEST NUMBER
- Be concise. Use simple and easy-to-understand language. Write in short sentences.
- DO NOT OVERTHINK! Help the user review this PR like a senior developer would - thoroughly yet efficiently.
- Avoid doing 'todos', just get to work.
