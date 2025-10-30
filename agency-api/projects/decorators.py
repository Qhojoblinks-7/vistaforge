import graphene
from functools import wraps
from django.core.exceptions import PermissionDenied
from graphene import ResolveInfo
from typing import Callable, Any


def superuser_only(resolver: Callable[..., Any]) -> Callable[..., Any]:
    """
    Custom decorator to restrict resolver access to the sole authenticated superuser.

    Raises:
        PermissionDenied: If the user is unauthenticated or is not a superuser.
    """
    @wraps(resolver)
    def wrapper(root: Any, info: ResolveInfo, **kwargs: Any) -> Any:
        user = info.context.user

        # Check 1: Authentication is mandatory
        if not user.is_authenticated:
            raise PermissionDenied("Authentication is required for this operation.")

        # Check 2: Enforcement of the 'Sole Authorized User' policy
        # NOTE: This is the critical security check. Modify this line
        # based on the definitive attribute (e.g., user.username == 'vista_admin').
        if not user.is_superuser:
            raise PermissionDenied("Access denied. Only the designated system administrator is authorized.")

        return resolver(root, info, **kwargs)

    return wrapper