import json
import urllib.request
import sys

URL = "http://127.0.0.1:8000/graphql/"

def graphql(query, variables=None, token=None):
    payload = json.dumps({"query": query, "variables": variables}).encode('utf-8')
    req = urllib.request.Request(URL, data=payload, headers={"Content-Type": "application/json"})
    if token:
        req.add_header('Authorization', f"JWT {token}")
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read().decode())
    except Exception as exc:
        print('HTTP ERROR:', exc)
        try:
            # attempt to read body if available
            if hasattr(exc, 'read'):
                print(exc.read())
        except Exception:
            pass
        sys.exit(1)

if __name__ == '__main__':
    # 1) Obtain token
    token_mutation = '''mutation TokenAuth($username:String!, $password:String!){ tokenAuth(username:$username,password:$password){ token } }'''
    vars = {"username": "dev_admin", "password": "DevPass123!"}
    print('Requesting token...')
    resp = graphql(token_mutation, vars)
    print(json.dumps(resp, indent=2))
    try:
        token = resp['data']['tokenAuth']['token']
    except Exception:
        print('Failed to get token; aborting')
        sys.exit(2)

    # 2) Create a client
    # Use camelCase field names expected by the GraphQL schema
    create_client_mutation = '''mutation CreateClient($input: ClientInput!){ createClient(input:$input){ client{ id name company contactEmail } } }'''
    client_input = {"name": "E2E Test Client", "company": "ACME E2E", "contactEmail": "e2e@local"}
    print('\nCreating client...')
    resp = graphql(create_client_mutation, {"input": client_input}, token=token)
    print(json.dumps(resp, indent=2))
    try:
        client_id = resp['data']['createClient']['client']['id']
    except Exception:
        print('Failed to create client; aborting')
        sys.exit(3)

    # 3) Create an invoice for that client
    # Use camelCase fields to match GraphQL schema
    create_invoice_mutation = '''mutation CreateInvoice($input: InvoiceInput!){ createInvoice(input:$input){ invoice{ id invoiceNumber subtotal tax discount total status client{ id name } items{ id description quantity rate amount } } } }'''
    invoice_input = {
        "clientId": client_id,
        "issueDate": "2025-11-19",
        "dueDate": "2025-12-19",
        "items": [{"description": "Design work", "quantity": 10, "rate": 50}],
        "notes": "E2E test invoice"
    }
    print('\nCreating invoice...')
    resp = graphql(create_invoice_mutation, {"input": invoice_input}, token=token)
    print(json.dumps(resp, indent=2))
    try:
        invoice = resp['data']['createInvoice']['invoice']
        invoice_id = invoice['id']
    except Exception:
        print('Failed to create invoice; aborting')
        sys.exit(4)

    # 4) Send the invoice
    send_invoice_mutation = '''mutation SendInvoice($id: ID!){ sendInvoice(id:$id){ success invoice{ id status } } }'''
    print('\nSending invoice...')
    resp = graphql(send_invoice_mutation, {"id": invoice_id}, token=token)
    print(json.dumps(resp, indent=2))

    # 5) Mark invoice paid
    # Request camelCase fields (paidDate)
    mark_paid_mutation = '''mutation MarkInvoicePaid($id: ID!){ markInvoicePaid(id:$id){ success invoice{ id status paidDate } } }'''
    print('\nMarking invoice as paid...')
    resp = graphql(mark_paid_mutation, {"id": invoice_id}, token=token)
    print(json.dumps(resp, indent=2))

    print('\nE2E sequence complete.')
