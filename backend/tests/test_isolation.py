"""Row-level isolation tests.

Regression coverage for the "TEMPORARILY DISABLE AUTH FILTERING FOR DEBUGGING"
resolvers, which returned `Model.objects.all()` and exposed every user's
clients, invoices, time logs, and projects to any caller.
"""

from datetime import date

import pytest
from django.contrib.auth.models import AnonymousUser
from django.test import RequestFactory
from graphene.test import Client as GraphQLClient

from backend.schema import schema

pytestmark = pytest.mark.django_db

_request_factory = RequestFactory()


@pytest.fixture
def gql():
    return GraphQLClient(schema)


def jwt_context(user):
    """Request object with an authenticated user, as middleware would set."""
    request = _request_factory.post("/graphql/")
    request.user = user
    return request


def anon_context():
    """Request object for an unauthenticated caller."""
    request = _request_factory.post("/graphql/")
    request.user = AnonymousUser()
    return request


def make_invoice(user, client, number="INV-1", subtotal=100):
    from invoices_app.models import Invoice

    return Invoice.objects.create(
        user=user,
        client=client,
        invoice_number=number,
        issue_date=date.today(),
        due_date=date.today(),
        subtotal=subtotal,
    )


def make_time_log(user, client, minutes=120):
    from datetime import timedelta

    from django.utils import timezone

    from time_logs_app.models import TimeLog

    start = timezone.now() - timedelta(minutes=minutes)
    return TimeLog.objects.create(
        user=user,
        client=client,
        start_time=start,
        end_time=timezone.now(),
        duration_minutes=minutes,
    )


def make_invoice_project(user, client, title="Secret work"):
    from invoices_app.models import InvoiceProject

    return InvoiceProject.objects.create(user=user, client=client, title=title)


# --- Anonymous access ---


def test_anonymous_cannot_list_invoices(gql, user_a, client_for):
    make_invoice(user_a, client_for)

    result = gql.execute("{ allInvoices { invoiceNumber } }", context_value=anon_context())
    assert not result.get("errors"), result.get("errors")
    assert result["data"]["allInvoices"] == []


def test_anonymous_cannot_list_time_logs(gql, user_a, client_for):
    make_time_log(user_a, client_for)

    result = gql.execute("{ allTimeLogs { id } }", context_value=anon_context())
    assert not result.get("errors"), result.get("errors")
    assert result["data"]["allTimeLogs"] == []


def test_anonymous_cannot_list_management_projects(gql, user_a, client_for):
    make_invoice_project(user_a, client_for)

    result = gql.execute(
        "{ allManagementProjects { title } }", context_value=anon_context()
    )
    assert not result.get("errors"), result.get("errors")
    assert result["data"]["allManagementProjects"] == []


def test_anonymous_cannot_list_clients(gql, client_for):
    from clients_app.models import Client

    assert Client.objects.count() == 1

    result = gql.execute("{ allClients { name } }", context_value=anon_context())
    assert not result.get("errors"), result.get("errors")
    assert result["data"]["allClients"] == []


def test_anonymous_project_listing_does_not_error(gql, user_a, client_for):
    """Public project listing must work without a token."""
    result = gql.execute("{ allProjects { title } }", context_value=anon_context())
    assert not result.get("errors"), result.get("errors")
    assert "allProjects" in result["data"]


# --- Cross-user access ---


def test_user_b_cannot_see_user_a_invoices(gql, user_a, user_b, client_for):
    make_invoice(user_a, client_for)

    result = gql.execute(
        "{ allInvoices { invoiceNumber } }", context_value=jwt_context(user_b)
    )
    assert not result.get("errors"), result.get("errors")
    assert result["data"]["allInvoices"] == []


def test_user_b_cannot_see_user_a_time_logs(gql, user_a, user_b, client_for):
    make_time_log(user_a, client_for)

    result = gql.execute(
        "{ allTimeLogs { id } }", context_value=jwt_context(user_b)
    )
    assert not result.get("errors"), result.get("errors")
    assert result["data"]["allTimeLogs"] == []


def test_user_b_cannot_see_user_a_management_projects(
    gql, user_a, user_b, client_for
):
    make_invoice_project(user_a, client_for)

    result = gql.execute(
        "{ allManagementProjects { title } }", context_value=jwt_context(user_b)
    )
    assert not result.get("errors"), result.get("errors")
    assert result["data"]["allManagementProjects"] == []


# --- Owner access still works ---


def test_user_sees_own_invoices(gql, user_a, client_for):
    make_invoice(user_a, client_for, number="INV-MINE")

    result = gql.execute(
        "{ allInvoices { invoiceNumber } }", context_value=jwt_context(user_a)
    )
    assert not result.get("errors"), result.get("errors")
    names = [i["invoiceNumber"] for i in result["data"]["allInvoices"]]
    assert "INV-MINE" in names


def test_user_sees_own_time_logs(gql, user_a, client_for):
    make_time_log(user_a, client_for)

    result = gql.execute(
        "{ allTimeLogs { id } }", context_value=jwt_context(user_a)
    )
    assert not result.get("errors"), result.get("errors")
    assert len(result["data"]["allTimeLogs"]) == 1


def test_user_sees_only_own_invoices_when_both_exist(
    gql, user_a, user_b, client_for, other_client_for
):
    make_invoice(user_a, client_for, number="INV-A")
    make_invoice(user_b, other_client_for, number="INV-B")

    result = gql.execute(
        "{ allInvoices { invoiceNumber } }", context_value=jwt_context(user_a)
    )
    names = sorted(i["invoiceNumber"] for i in result["data"]["allInvoices"])
    assert names == ["INV-A"]
