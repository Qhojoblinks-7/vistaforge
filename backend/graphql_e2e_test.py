"""End-to-end GraphQL smoke test.

Exercises the full invoice lifecycle against a RUNNING server:
    python manage.py runserver 8000
    python graphql_e2e_test.py

Creates its own throwaway user so it works on a fresh clone with no
pre-existing accounts, and cleans up the records it creates.

This is a smoke test for a live deployment. The authoritative suite is
`pytest`, which runs in-process and does not need a server.
"""

import json
import os
import sys
import urllib.request
from datetime import date, timedelta

URL = os.getenv("GRAPHQL_URL", "http://127.0.0.1:8000/graphql/")

TEST_USERNAME = "e2e_smoke_user"
TEST_PASSWORD = "E2eSmokePass123!"

# Unique per run so repeated runs don't collide on unique fields.
RUN_ID = date.today().strftime("%Y%m%d")


def graphql(query, variables=None, token=None):
    payload = json.dumps({"query": query, "variables": variables}).encode("utf-8")
    req = urllib.request.Request(
        URL, data=payload, headers={"Content-Type": "application/json"}
    )
    if token:
        req.add_header("Authorization", f"JWT {token}")
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read().decode())
    except Exception as exc:
        print("HTTP ERROR:", exc)
        if hasattr(exc, "read"):
            try:
                print(exc.read().decode())
            except Exception:
                pass
        sys.exit(1)


def bootstrap_user():
    """Create the test user directly in the database, via Django ORM."""
    try:
        import django
    except ImportError:
        print(
            "Django is not importable. Run this from the backend directory "
            "with the virtualenv active."
        )
        sys.exit(1)

    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
    django.setup()

    from django.contrib.auth import get_user_model

    U = get_user_model()
    user, created = U.objects.get_or_create(
        username=TEST_USERNAME,
        defaults={"email": "e2e_smoke@example.local", "is_active": True},
    )
    user.is_active = True
    user.set_password(TEST_PASSWORD)
    user.save()
    print(f"User ready: {user.username} ({'created' if created else 'updated'})")
    return user


def cleanup(user):
    """Remove records this script created."""
    from clients_app.models import Client
    from invoices_app.models import Invoice, InvoiceProject

    Invoice.objects.filter(user=user).delete()
    InvoiceProject.objects.filter(user=user).delete()
    Client.objects.filter(user=user).delete()
    print("Cleaned up test records.")


def main():
    user = bootstrap_user()

    try:
        # 1) Obtain token
        token_mutation = """mutation TokenAuth($username:String!, $password:String!){
            tokenAuth(username:$username, password:$password){ token }
        }"""
        print("\nRequesting token...")
        resp = graphql(
            token_mutation, {"username": TEST_USERNAME, "password": TEST_PASSWORD}
        )
        try:
            token = resp["data"]["tokenAuth"]["token"]
            print("Token acquired.")
        except (KeyError, TypeError):
            print("Failed to get token; aborting")
            print(json.dumps(resp, indent=2))
            sys.exit(2)

        # 2) Create a client
        create_client_mutation = """mutation CreateClient($input: ClientInput!){
            createClient(input:$input){ client{ id name company contactEmail } }
        }"""
        client_input = {
            "name": f"E2E Test Client {RUN_ID}",
            "company": "ACME E2E",
            "contactEmail": "e2e@local",
        }
        print("\nCreating client...")
        resp = graphql(create_client_mutation, {"input": client_input}, token=token)
        try:
            client_id = resp["data"]["createClient"]["client"]["id"]
        except (KeyError, TypeError):
            print("Failed to create client; aborting")
            print(json.dumps(resp, indent=2))
            sys.exit(3)

        # 3) Create an invoice for that client
        create_invoice_mutation = """mutation CreateInvoice($input: InvoiceInput!){
            createInvoice(input:$input){
                invoice{
                    id invoiceNumber subtotal tax discount total status
                    client{ id name }
                    items{ id description quantity rate amount }
                }
            }
        }"""
        today = date.today()
        invoice_input = {
            "clientId": client_id,
            "issueDate": today.isoformat(),
            "dueDate": (today + timedelta(days=30)).isoformat(),
            "items": [{"description": "Design work", "quantity": 10, "rate": 50}],
            "notes": "E2E test invoice",
        }
        print("\nCreating invoice...")
        resp = graphql(create_invoice_mutation, {"input": invoice_input}, token=token)
        try:
            invoice_id = resp["data"]["createInvoice"]["invoice"]["id"]
        except (KeyError, TypeError):
            print("Failed to create invoice; aborting")
            print(json.dumps(resp, indent=2))
            sys.exit(4)

        # 4) Send the invoice
        print("\nSending invoice...")
        send_invoice_mutation = """mutation SendInvoice($id: ID!){
            sendInvoice(id:$id){ success invoice{ id status } }
        }"""
        resp = graphql(send_invoice_mutation, {"id": invoice_id}, token=token)
        sent = resp.get("data", {}).get("sendInvoice", {})
        if not sent.get("success"):
            print("Failed to send invoice; aborting")
            print(json.dumps(resp, indent=2))
            sys.exit(5)
        print(f"  status -> {sent['invoice']['status']}")

        # 5) Mark invoice paid
        print("\nMarking invoice as paid...")
        mark_paid_mutation = """mutation MarkInvoicePaid($id: ID!){
            markInvoicePaid(id:$id){ success invoice{ id status paidDate } }
        }"""
        resp = graphql(mark_paid_mutation, {"id": invoice_id}, token=token)
        paid = resp.get("data", {}).get("markInvoicePaid", {})
        if not paid.get("success"):
            print("Failed to mark invoice paid; aborting")
            print(json.dumps(resp, indent=2))
            sys.exit(6)
        print(f"  status -> {paid['invoice']['status']}")

        # 6) Confirm the client revenue reflects the payment
        print("\nVerifying client revenue updated...")
        revenue_query = """query($id: ID!){ client(id:$id){ id name totalRevenue } }"""
        resp = graphql(revenue_query, {"id": client_id}, token=token)
        client_data = resp.get("data", {}).get("client")
        if not client_data:
            print("Could not read back client; aborting")
            print(json.dumps(resp, indent=2))
            sys.exit(7)
        print(f"  totalRevenue -> {client_data.get('totalRevenue')}")
        if float(client_data.get("totalRevenue") or 0) <= 0:
            print("FAIL: revenue did not update after payment")
            sys.exit(8)

        print("\nE2E sequence complete.")
    finally:
        cleanup(user)


if __name__ == "__main__":
    main()
