# ACTION REQUIRED: rotate these credentials

## Status

`.env`, `backend/.env`, and `backend/db.sqlite3` are now gitignored and
untracked. The committed `backend/.env.example` has been sanitized.

**However, removing a secret from the working tree does not remove it from git
history.** The values below are still readable by anyone with repository
access, at the commits listed.

## Exposed

An admin password was committed to `backend/.env.example` in commits
`6418ee9` and `ba1dc97`, along with a personal Gmail address. It has been
replaced with placeholders in the current file, but the historical versions
still contain the real value.

## Required actions

### 1. Rotate the admin password (do this first)

The seeded superuser is recreated on every deploy by
`scripts/create_admin_from_env.py`, which reads `ADMIN_PASSWORD` from the
environment. Update it in the Render dashboard:

1. Render dashboard -> `vistaforge-backend` -> Environment
2. Set `ADMIN_PASSWORD` to a new strong value:
   `python -c "import secrets; print(secrets.token_urlsafe(32))"`
3. Also update `ADMIN_USER` and `ADMIN_EMAIL` if the old ones are compromised
4. Save and redeploy

Locally, update the matching values in your untracked `backend/.env`.

### 2. Rotate the exposed email credentials

The Gmail address `immanueleshun15@gmail.com` was committed. If that account
has app passwords or is used for SMTP, regenerate the app password in Google
account settings and update `EMAIL_HOST_PASSWORD` in Render.

### 3. Decide whether to scrub history

- **Private repo, trusted access:** rotation alone is sufficient. The history
  is a lesser risk, but the values remain technically exposed.
- **Public or shared repo:** rewrite history so the secrets are gone:
  ```bash
  pip install git-filter-repo
  git filter-repo --path backend/.env.example --invert-paths
  git push --force --mirror origin
  ```
  Coordinate first, since a force-push invalidates every existing clone and
  open PR.

After rotating, the values in old commits are harmless because they no longer
authenticate against anything.

## Prevention

`.gitignore` now covers `.env`, `.env.*` (with `!.env.example`), `*.pem`,
`*.key`, `*.sqlite3`, and credential JSON files. `.env.example` files must
contain placeholders only.

`backend/backend/settings.py` raises `ImproperlyConfigured` if `SECRET_KEY` is
unset when `ENVIRONMENT=production`, so a deployment can no longer silently
fall back to the development key.
