# Nowline Digital Hall Runtime

## Canonical status

The canonical runtime integration lives in `services/` in this repository. The implementation was consolidated from the A11 Nowline estate without deleting the source repository.

## Services

- `auth-gateway` — OIDC Authorization Code + PKCE entry and callback.
- `launcher` — owner-controlled launch requests with short-lived RS256 JWTs.
- `orchestrator` — emergency-stop state and command boundary.
- `mcp` — HMAC-verified webhook bridge for external automation events.
- `payments` — Stripe webhook signature verification.
- `routing` — shared language resolution used by runtime surfaces.

## Verification rule

Source presence is not deployment proof. A release is only `VERIFIED` after code checks, CI, deployment evidence, health checks, and the live endpoint have all been independently confirmed.

## Configuration

Secrets must remain server-side and must be supplied by the deployment platform. No secret values belong in source, browser bundles, URLs, commits, screenshots, or logs.

## Owner seal

Deployment, credential changes, public publication, payments, deletion, and other irreversible actions remain approval-gated. This repository change does not itself deploy the services.
