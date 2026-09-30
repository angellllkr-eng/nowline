# Nowline runtime reconciliation

Date: 2026-09-30

## Evidence-first reconciliation

The owner-controlled repositories were reviewed before any write:

- `angellllkr-eng/nowline` — canonical Nowline product repository.
- `angellllkr-eng/a11-nowline` — separate Digital Hall/runtime implementation source.
- `angellllkr-eng/a11-sovereign-nowline` — legacy/source-freeze surface; not a production authority.

The canonical repository already contained the core runtime surfaces for auth-gateway, launcher, routing, MCP webhook, payments webhook and orchestrator. The reconciliation branch adds the missing worker runtime, observability helper, Stripe checkout endpoint and worker queue tests identified in the separate implementation.

## Imported capability boundary

Reconciled into the canonical repository without deleting or mutating the source repositories:

- OIDC PKCE auth gateway
- RS256 short-lived launcher JWT
- language routing for en/bg/de/fr/es/it/nl/pl/ro/el
- Zapier HMAC webhook boundary
- Stripe webhook verification
- Stripe subscription checkout session creation
- emergency-stop orchestrator boundary
- bounded worker queue with idempotency, leases, retries and dead-letter handling
- trace/event observability helper

## Security boundary

No credentials, private keys, webhook secrets or provider tokens are copied into the repository. Runtime secrets remain environment/secret-manager concerns. The reconciled code does not mark external infrastructure as live merely because source files exist.

## Verification state

- VERIFIED: source repositories located and reconciled read-only before write.
- VERIFIED: canonical `main` already contained most Digital Hall runtime surfaces.
- READY: branch contains the missing runtime components and tests.
- UNVERIFIED: GitHub Actions execution for this branch until the workflow run completes.
- UNVERIFIED: Cloud Run, DNS, Stripe, Zapier, OIDC and Secret Manager production wiring.
- NO deletion/archive action performed.

## Next gate

CI must validate build/lint/typecheck/test. Only after CI evidence should a merge be considered. External deployment remains a separate approval/evidence gate.
