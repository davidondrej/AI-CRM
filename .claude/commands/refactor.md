# /refactor – Cleanup and improve current MVP

**Scope:** Only consider the changes introduced in this session; the refactor should be limited to that diff.

**Purpose:** Break large files into smaller, cohesive modules that respect SOLID principles and Vectal's coding standards while keeping each file under 300 LOC.

### Step‑by‑Step Instructions

1. **Analyze scope**
   * Read the target file(s) fully.
   * Identify distinct responsibilities, data models, side‑effects, and UI concerns.

2. **Plan split**
   * Group related logic into well‑named functions/classes.
   * Draft a file structure where each new file focuses on a single responsibility.
   * Aim for files ≤ 300 LOC (including header comments and imports).

3. **Apply SOLID & Vectal standards**
   * **S**: Single‑Responsibility—each file/class handles one job.
   * **O**: Open/Closed—design for extension via dependency injection or subclassing, avoid modifying existing stable code.
   * **L**: Liskov Substitution—preserve interfaces when extracting abstractions.
   * **I**: Interface Segregation—keep public APIs minimal per concern.
   * **D**: Dependency Inversion—depend on abstractions, not concrete implementations.
   * Follow project conventions: header comments, neutral color classes, no new complexity.

4. **Refactor with patches**
   * Never exceed 300 LOC per new file.
   * Update imports/exports and tests.

5. **Validate**
   * Ensure all unit & integration tests pass.
   * Confirm build commands (`uvicorn`, `python -m pytest`, `npm run dev`) still start without errors.
   * Perform a quick manual smoke test if possible.

6. **Document**
   * At the top of each new file, add the 4‑line header comments (file path, purpose, why, relevant files).

Repeat for every added/updated file. Provide a concise summary underneath the patches.

### Guard‑rails

* No feature creep—implement only the requested refactor.
* Keep logic simple; avoid over‑engineering.
* Respect existing architecture (FastAPI, Next.js, etc.).
* If a single responsibility still exceeds 300 LOC, propose a second‑level split instead of violating the limit.

$ARGUMENTS
