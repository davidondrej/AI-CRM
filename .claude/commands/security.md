# /security – Scan new code for potential vulnerabilities

**Purpose:** Detect and report security vulnerabilities—code smells, misconfigurations, dependency CVEs, and leaked secrets—before they reach production.

**Scope:** Only consider the changes introduced in this session; the refactor should be limited to that diff.

### Step‑by‑Step Instructions

1. **Collect targets**
   * Enumerate all source files (`*.py`, `*.ts`, `*.js`, `*.tsx`, `*.go`, etc.).
   * Include infrastructure files (`Dockerfile`, `docker-compose.*`, `*.yaml`, `*.yml`, `helm/`, `terraform/`).
   * Read dependency manifests (`requirements*.txt`, `pyproject.toml`, `package.json`, `go.mod`, etc.).

2. **Run static analysis**
   * Flag insecure patterns mapped to OWASP Top 10 & CWE (e.g., unsanitized input, hard‑coded SQL, insecure deserialization, SSRF, XSS).
   * Highlight dangerous functions (`eval`, `exec`, `pickle.loads`, `child_process.exec`).
   * Identify weak crypto and insecure random number generation.

3. **Audit dependencies**
   * Cross‑reference package versions against public CVE databases.
   * Mark outdated or unsupported packages.

4. **Scan for secrets & config leaks**
   * Search for API keys, tokens, passwords, certificates, `.env` values.
   * Check IaC files for open security groups, public S3 buckets, loose IAM policies.

5. **Generate findings**
   * For each issue capture:
     * `file_path`, `start_line`, `end_line`
     * `severity` (Critical | High | Medium | Low)
     * `cwe` or rule id
     * `summary` (one‑sentence description)
     * `recommendation` (actionable fix or mitigation)
   * Group duplicates; avoid noisy false positives.

6. **Validate & prioritize**
   * De‑duplicate by hash/location.
   * Downgrade severity if issue is mitigated elsewhere (e.g., paramized queries wrapping raw SQL).
   * Highlight issues touching public exposure layers first (HTTP handlers, DB drivers).

Return **only** the formatted findings report followed by a concise plaintext summary listing counts per severity level.

### Guard‑rails
* **No automatic code changes.** Provide a follow‑up patch suggestion only if explicitly requested.
* Keep the report actionable; omit theoretical vulnerabilities lacking exploitable context.
* Never expose full secrets; mask with `****` when echoing lines.
* Respect the 100 issue limit—if more, aggregate lesser findings.

$ARGUMENTS
