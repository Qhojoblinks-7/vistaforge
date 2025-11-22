#!/usr/bin/env python3
"""
Poll deployed backend and frontend until expected CORS and GraphQL responses are observed.
Usage: python scripts/poll_deploy.py
"""
import urllib.request
import urllib.error
import json
import time
from datetime import datetime, timedelta

BACKEND = 'https://vistaforge.onrender.com/graphql'
FRONTEND_PAGE = 'https://vistaforge.vercel.app/portfolio'
ORIGIN = 'https://vistaforge.vercel.app'

POLL_INTERVAL = 12  # seconds
TIMEOUT = 15 * 60  # 15 minutes


def now():
    return datetime.utcnow().isoformat() + 'Z'


def do_options():
    req = urllib.request.Request(BACKEND, method='OPTIONS')
    req.add_header('Origin', ORIGIN)
    req.add_header('Access-Control-Request-Method', 'POST')
    req.add_header('Access-Control-Request-Headers', 'content-type,authorization')
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            status = resp.getcode()
            allow = resp.getheader('Access-Control-Allow-Origin')
            return True, status, allow
    except urllib.error.HTTPError as e:
        return False, e.code, None
    except Exception as e:
        return False, None, None


def do_post():
    body = json.dumps({'query': '{ __typename }'}).encode('utf-8')
    req = urllib.request.Request(BACKEND, data=body, method='POST')
    req.add_header('Origin', ORIGIN)
    req.add_header('Content-Type', 'application/json')
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            status = resp.getcode()
            allow = resp.getheader('Access-Control-Allow-Origin')
            raw = resp.read()
            try:
                parsed = json.loads(raw.decode('utf-8'))
            except Exception:
                parsed = raw.decode('utf-8', errors='replace')
            return True, status, allow, parsed
    except urllib.error.HTTPError as e:
        try:
            body = e.read().decode('utf-8', errors='replace')
        except Exception:
            body = ''
        return False, e.code, None, body
    except Exception as e:
        return False, None, None, None


def do_frontend_get():
    req = urllib.request.Request(FRONTEND_PAGE, method='GET')
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            status = resp.getcode()
            content = resp.read(2000)
            return True, status, len(content), content.decode('utf-8', errors='replace')
    except urllib.error.HTTPError as e:
        return False, e.code, 0, None
    except Exception as e:
        return False, None, 0, None


if __name__ == '__main__':
    deadline = datetime.utcnow() + timedelta(seconds=TIMEOUT)
    print(f"[{now()}] Starting deploy poll. Timeout in {TIMEOUT//60} minutes.")
    success = False
    attempt = 0
    while datetime.utcnow() < deadline:
        attempt += 1
        print(f"[{now()}] Attempt {attempt}: running OPTIONS -> POST -> GET checks")
        o_ok, o_status, o_allow = do_options()
        print(f"  OPTIONS: ok={o_ok} status={o_status} Access-Control-Allow-Origin={o_allow}")

        p_ok, p_status, p_allow, p_body = do_post()
        print(f"  POST: ok={p_ok} status={p_status} Access-Control-Allow-Origin={p_allow} body_preview={str(p_body)[:200]}")

        f_ok, f_status, f_len, f_body = do_frontend_get()
        print(f"  FRONTEND GET: ok={f_ok} status={f_status} html_bytes_preview={f_len}")

        # success criteria
        if o_ok and o_status == 200 and o_allow == ORIGIN and p_ok and p_status == 200 and p_allow == ORIGIN:
            print(f"[{now()}] SUCCESS: Backend CORS and GraphQL POST responding correctly.")
            success = True
            break

        # otherwise wait
        remaining = (deadline - datetime.utcnow()).total_seconds()
        print(f"  Not ready yet. Waiting {POLL_INTERVAL}s (remaining {int(remaining)}s)")
        time.sleep(POLL_INTERVAL)

    if not success:
        print(f"[{now()}] TIMEOUT: Deploy checks did not succeed within timeout.")
        raise SystemExit(2)
    else:
        print(f"[{now()}] All checks passed. Exiting.")
        raise SystemExit(0)
