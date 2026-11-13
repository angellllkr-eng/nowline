# WT-005 — CI Evidence Addendum

Checked 2026-11-13 on audit head `ad4c9f465cd0727a5106d306ef3d1216ac39eacf`:
- [Repository Integrity Gate 43374560273](https://github.com/angellllkr-eng/nowline/actions/runs/43374560273): completed with failure.
- [Estate Green Gate 43374560102](https://github.com/angellllkr-eng/nowline/actions/runs/43374560102): completed with failure.

Earlier pushes at the same base SHA also failed these gates. The job-step endpoint returned no steps and the log endpoint returned BlobNotFound, so the failing check and root cause are not available from this connector response.

**Status:** CONTINUE — retrieve run annotations/check-suite details or owner-accessible logs. Do not treat the documented CI matrix as a passing run.
