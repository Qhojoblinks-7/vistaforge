"""Authentication tests for the tokenAuth mutation and JWT verification."""

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


def ctx(user):
    request = _request_factory.post("/graphql/")
    request.user = user
    return request


def test_token_auth_succeeds_with_valid_credentials(gql, user_a):
    result = gql.execute(
        'mutation { tokenAuth(username: "alice", password: "TestPass123!") { token } }',
        context_value=ctx(AnonymousUser()),
    )
    assert not result.get("errors"), result.get("errors")
    assert result["data"]["tokenAuth"]["token"]


def test_token_auth_rejects_wrong_password(gql, user_a):
    result = gql.execute(
        'mutation { tokenAuth(username: "alice", password: "wrong") { token } }',
        context_value=ctx(AnonymousUser()),
    )
    assert result.get("errors"), "invalid credentials must be rejected"
    assert result["data"]["tokenAuth"] is None


def test_token_auth_rejects_unknown_user(gql, db):
    result = gql.execute(
        'mutation { tokenAuth(username: "nobody", password: "TestPass123!") { token } }',
        context_value=ctx(AnonymousUser()),
    )
    assert result.get("errors"), "unknown user must be rejected"
    assert result["data"]["tokenAuth"] is None


def test_me_returns_authenticated_user(gql, user_a):
    result = gql.execute("{ me { username } }", context_value=ctx(user_a))
    assert not result.get("errors"), result.get("errors")
    assert result["data"]["me"]["username"] == "alice"


def test_verify_token_accepts_valid_token(gql, user_a):
    from graphql_jwt.shortcuts import get_token

    token = get_token(user_a)
    result = gql.execute(
        "mutation($t: String!) { verifyToken(token: $t) { payload } }",
        variables={"t": str(token)},
        context_value=ctx(AnonymousUser()),
    )
    assert not result.get("errors"), result.get("errors")
    assert result["data"]["verifyToken"]["payload"]


def test_verify_token_rejects_garbage(gql, user_a):
    result = gql.execute(
        "mutation($t: String!) { verifyToken(token: $t) { payload } }",
        variables={"t": "not-a-real-token"},
        context_value=ctx(AnonymousUser()),
    )
    assert result.get("errors")
