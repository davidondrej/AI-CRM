Find files with missing header comments in: $ARGUMENTS.

**GOAL:** LOCATE (not fix!) 4 files with missing or inadequate header comments, especially missing "RELEVANT FILES" section.

## STEP-BY-STEP PROCESS:

1. STEP 01: Search the specified area ($ARGUMENTS) for files using Grep/Glob tools
   - Look for .ts, .tsx, .py files
   - Prioritize core files over config/test files

2. STEP 02: Read the first 10 lines of each file to check header comments
   - Missing header = no comments at top
   - Inadequate = wrong file path or missing RELEVANT FILES section

3. STEP 03: Identify 4 files that need header comments (prioritize completely missing headers)

4. STEP 04: DO NOT FIX ANYTHING! Just report what you found:
   ```
   Expected header format (for reference):
   // exact/file/location/in/codebase
   // Clear description of what this file does
   // Clear description of WHY this file exists  
   // RELEVANT FILES: comma-separated list of 2-4 most relevant files
   ```

5. STEP 05: Output summary:
   - List the 4 files you found
   - One line per file explaining what's missing/wrong
   - Use 🔍 for found issues, ❌ for missing headers, ⚠️ for outdated headers

## CRITICAL RULES:
- **DO NOT EDIT ANY FILES** - only locate and report
- **DO NOT FIX ANYTHING** until user explicitly asks
- FOCUS on finding files missing "RELEVANT FILES" section
- Just identify problems, don't solve them
- Prioritize important business logic files over utilities