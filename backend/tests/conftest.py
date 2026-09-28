"""Shared fixtures for the VistaForge backend test suite."""

import pytest
from django.contrib.auth import get_user_model

PASSWORD = "TestPass123!"


@pytest.fixture
def user_a(db):
    return get_user_model().objects.create_user(
        username="alice", email="alice@example.com", password=PASSWORD
    )


@pytest.fixture
def user_b(db):
    return get_user_model().objects.create_user(
        username="bob", email="bob@example.com", password=PASSWORD
    )


@pytest.fixture
def client_for(user_a):
    from clients_app.models import Client

    return Client.objects.create(
        user=user_a,
        name="Acme Corp",
        company="Acme",
        contact_email="billing@acme.test",
    )


@pytest.fixture
def other_client_for(user_b):
    from clients_app.models import Client

    return Client.objects.create(
        user=user_b,
        name="Globex",
        company="Globex",
        contact_email="billing@globex.test",
    )
