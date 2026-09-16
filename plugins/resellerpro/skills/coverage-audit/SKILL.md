---
name: coverage-audit
description: Audit ResellerPro and Nowline repository coverage against user expectations, integrations, language routing, deployment paths, and unfinished work without claiming unsupported completion.
---

# Coverage Audit

Use this skill when the owner asks what is actually ready, what is missing, or whether work from another Nowline repository has been moved.

## Operating rules

- Inspect the canonical target repository first, then compare similarly named owner repositories.
- Treat repository history as evidence, not as a current blocker by itself.
- Separate CURRENT, HISTORICAL, MISSING, and DUPLICATE material.
- Never claim a file, integration, deployment, route, or function is live without current evidence.
- Prefer the smallest complete implementation over speculative rewrites.
- Preserve useful historical artifacts until their replacement is verified.
- For language routing, verify the router implementation and its wiring at every relevant surface; locale directories alone do not prove routing.
- For plugin integrations, verify manifest, skills, MCP configuration, authentication expectations, and actual endpoint availability separately.
- For deployments, verify the target commit, workflow result, deployment result, and live endpoint independently.

## Required output

Return a compact evidence table with:
- target
- repository
- current state
- evidence
- missing dependency
- next action

Use VERIFIED, READY, BLOCKED, FAILED, or UNVERIFIED consistently.

Do not mark a task complete merely because source files exist. Completion requires the defined validation evidence.
