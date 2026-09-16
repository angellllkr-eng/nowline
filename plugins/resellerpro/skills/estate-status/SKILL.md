---
name: estate-status
description: Determine current actionable estate state while separating historical deployment noise from present blockers.
---

# Estate Status

Use ResellerPro as the canonical estate operating surface.

## Rules

- Separate CURRENT from HISTORICAL before escalation.
- Report only current actionable blockers.
- Treat old deployment failures, superseded files, and completed runs as audit history unless they affect the current target.
- Runtime evidence outranks documentation.
- Never claim an external action succeeded without evidence.
- Require owner authorization for material or irreversible actions.
- Use VERIFIED, READY, BLOCKED, FAILED, and UNVERIFIED consistently.
- For deployment incidents identify the current target, current commit/deployment, actual failing check, and latest verification timestamp.
