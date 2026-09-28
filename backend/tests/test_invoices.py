"""Invoice business-logic tests.

Covers the money path: total calculation, client revenue on payment, and the
status transitions defined in the README business rules.
"""

from datetime import date, timedelta

import pytest

pytestmark = pytest.mark.django_db


def make_invoice(user, client, number="INV-1", subtotal=0, tax=0, discount=0,
                 status="DRAFT"):
    from invoices_app.models import Invoice

    return Invoice.objects.create(
        user=user,
        client=client,
        invoice_number=number,
        issue_date=date.today(),
        due_date=date.today() + timedelta(days=30),
        subtotal=subtotal,
        tax=tax,
        discount=discount,
        status=status,
    )


def test_total_is_subtotal_plus_tax_minus_discount(user_a, client_for):
    invoice = make_invoice(user_a, client_for, subtotal=100, tax=20, discount=5)
    assert invoice.total == 115


def test_total_with_no_tax_or_discount(user_a, client_for):
    invoice = make_invoice(user_a, client_for, subtotal=250)
    assert invoice.total == 250


def test_marking_paid_sets_paid_date(user_a, client_for):
    invoice = make_invoice(user_a, client_for, subtotal=100, status="SENT")
    assert invoice.paid_date is None

    invoice.status = "PAID"
    invoice.save()

    invoice.refresh_from_db()
    assert invoice.paid_date == invoice.issue_date


def test_explicit_paid_date_is_preserved(user_a, client_for):
    paid = date.today() - timedelta(days=3)
    invoice = make_invoice(user_a, client_for, subtotal=100, status="SENT")
    invoice.status = "PAID"
    invoice.paid_date = paid
    invoice.save()

    invoice.refresh_from_db()
    assert invoice.paid_date == paid


def test_invoice_numbers_are_unique(user_a, client_for):
    from django.db import IntegrityError, transaction

    make_invoice(user_a, client_for, number="INV-DUP")

    with pytest.raises(IntegrityError):
        with transaction.atomic():
            make_invoice(user_a, client_for, number="INV-DUP")


def test_cancelling_invoice_does_not_add_revenue(user_a, client_for):
    invoice = make_invoice(user_a, client_for, subtotal=100, status="SENT")
    invoice.status = "CANCELLED"
    invoice.save()

    client_for.refresh_from_db()
    assert client_for.total_revenue == 0


def test_sending_invoice_moves_amount_to_outstanding(user_a, client_for):
    invoice = make_invoice(user_a, client_for, subtotal=100, status="SENT")

    client_for.refresh_from_db()
    assert client_for.outstanding_balance == 100
    assert client_for.total_revenue == 0


def test_paid_invoice_updates_revenue_in_the_same_save(user_a, client_for):
    """Regression: client totals were recomputed before the invoice row was
    written, so revenue lagged by one save."""
    invoice = make_invoice(user_a, client_for, subtotal=100, status="SENT")

    invoice.status = "PAID"
    invoice.save()

    client_for.refresh_from_db()
    assert client_for.total_revenue == 100
    assert client_for.outstanding_balance == 0


def test_resaving_paid_invoice_is_idempotent(user_a, client_for):
    invoice = make_invoice(user_a, client_for, subtotal=100, status="SENT")
    invoice.status = "PAID"
    invoice.save()

    invoice.save()
    invoice.save()

    client_for.refresh_from_db()
    assert client_for.total_revenue == 100
    assert client_for.outstanding_balance == 0


def test_two_paid_invoices_accumulate(user_a, client_for):
    from clients_app.models import Client

    second = Client.objects.create(
        user=user_a, name="Second", contact_email="second@example.com"
    )

    first = make_invoice(user_a, client_for, number="INV-1", subtotal=100, status="SENT")
    first.status = "PAID"
    first.save()

    other = make_invoice(user_a, second, number="INV-2", subtotal=250, status="SENT")
    other.status = "PAID"
    other.save()

    client_for.refresh_from_db()
    second.refresh_from_db()
    assert client_for.total_revenue == 100
    assert second.total_revenue == 250
