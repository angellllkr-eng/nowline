# Security Polic
## Supported versions

Nowline is on `0.x`. The latest `0.x.y` line receives security fixes; older `0.x` lines do not. Once `1.0` ships, the policy will be revised to support the latest stable major and one previous major in line with SemVer expectations.

## Reporting a vulnerability

Please **do not** open a public issue for security problems. Use one of the private channels below:

1. **GitHub private vulnerability report (preferred).** Open a draft advisory at <https://github.com/lolay/nowline/security/advisories/new>. This keeps the report visible only to maintainers until a fix and disclosure plan are ready.
2. **Email.** If you cannot use GitHub's private reporting, email **security@nowline.io** with `[nowline security]` in the subject line.

In your report, please include:

- A description of the issue and the impact you believe it has.
- Steps to reproduce, or a minimal `.nowline` / JSON / command-line input that triggers the problem.
- The version or commit SHA you tested against (`nowline version` if you built the CLI).
- Your operating system and Node.js version.
- Any suggested mitigation, if you have one.

## What to expect

- We aim to acknowledge receipt within **3 business days**.
- We will keep you informed as we investigate, and will coordinate disclosure timing with you before publishing a fix or advisory.
- Once a fix lands, we will credit you in the advisory unless you ask us not to.

## Scope

In scope:

- The `@nowline/core` parser and validator.
- The `@nowline/layout` and `@nowline/renderer` packages.
- The `@nowline/cli` command-line tool, including all bundled exporters.
- Any code under this repository's `packages/` directory.

Out of scope (please report upstream):

- Vulnerabilities in third-party dependencies (Langium, pdfkit, exceljs, resvg, etc.) unless we expose them through misuse.
- Issues that require an attacker to already have full local-machine access.
- Denial-of-service from intentionally pathological `.nowline` input that exceeds reasonable resource budgets — we will accept these as bug reports rather than security advisories unless they enable privilege escalation or sandbox escape.
