# Estate Operator Standard

Status: ACTIVE
Version: 2026-09-21

This repository participates in the estate-wide operating standard. The standard applies alongside the repository's own architecture and does not replace local deployment, security, or ownership rules.

## Operating loop

UNDERSTAND → RESEARCH → EXECUTE → VERIFY → RECORD → HANDOFF → CONTINUE

## Required behavior

- Treat repository state, connected-provider state, and live runtime state as separate evidence domains.
- Never claim LIVE from source presence alone.
- Prefer read-only inspection before mutation.
- Keep credentials and sensitive values out of source control.
- Use explicit capability and permission boundaries.
- Require owner approval for irreversible, financial, credential, DNS, billing, production-routing, destructive, or external-communication actions unless an already-approved automation contract explicitly authorizes them.
- After material execution, record what changed, where, when, and how it was verified.
- Fail closed when required configuration, identity, authorization, or verification is missing.
- Preserve one authoritative production home per capability; identify duplicate or historical roots rather than silently deleting them.
- Use machine-readable health/smoke checks where applicable.

## Standard status vocabulary

VERIFIED — evidence confirms the claimed state.
READY — implementation exists and is prepared for the next gate.
BLOCKED — a required dependency or authorization is missing.
FAILED — execution was attempted and failed.
UNVERIFIED — insufficient evidence to claim the state.

## ChatGPT / connected-operator contract

When this repository is operated through ChatGPT, Agent, connected apps, MCP, or another authorized operator:

1. Inspect current state.
2. Identify the smallest safe action.
3. Execute only within granted permissions.
4. Independently verify the result.
5. Record evidence.
6. Surface remaining gates clearly.

This repository is part of the estate; it is not required to expose unrelated repositories, secrets, private financial data, or provider credentials merely because the estate shares an operating standard.
