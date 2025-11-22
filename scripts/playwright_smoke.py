#!/usr/bin/env python3
"""
Headless Playwright smoke test:
- Loads the Vercel frontend portfolio page
- Waits for a GraphQL POST to /graphql and records the response
- Prints a short report and exits with 0 on success
"""
import time
import json
from playwright.sync_api import sync_playwright

FRONTEND_URL = "https://vistaforge.vercel.app/portfolio"
GRAPHQL_PATH = "/graphql"

if __name__ == '__main__':
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        graphql_responses = []

        def on_response(resp):
            try:
                req = resp.request
            except Exception:
                return
            try:
                if GRAPHQL_PATH in resp.url and req.method == 'POST':
                    status = resp.status
                    try:
                        body = resp.json()
                    except Exception:
                        try:
                            text = resp.text()
                            body = text
                        except Exception:
                            body = None
                    graphql_responses.append((resp.url, status, body))
            except Exception:
                pass

        page.on('response', on_response)

        print('Opening', FRONTEND_URL)
        page.goto(FRONTEND_URL, wait_until='networkidle', timeout=30000)

        # wait up to 15s for a graphql response
        deadline = time.time() + 15
        while time.time() < deadline and not graphql_responses:
            time.sleep(0.5)

        if graphql_responses:
            print('Found GraphQL responses:')
            for url, status, body in graphql_responses:
                print('  URL:', url)
                print('  status:', status)
                if isinstance(body, (dict, list)):
                    summary = json.dumps(body)[:1000]
                else:
                    summary = str(body)[:1000]
                print('  body (truncated):', summary)
        else:
            print('No GraphQL POST response detected within timeout.')

        # Check for rendered DOM changes (simple heuristic)
        try:
            body_text = page.inner_text('body')
            snippet = body_text[:1000]
            print('\nBody text preview (first 1000 chars):')
            print(snippet)
        except Exception as e:
            print('Could not read page body text:', e)

        browser.close()
