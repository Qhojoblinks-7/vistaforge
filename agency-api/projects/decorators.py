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

        # Debug: check if Authorization header reached Django (mask token for privacy)
        auth_header = None
        try:
            auth_header = info.context.META.get('HTTP_AUTHORIZATION')
        except Exception:
            # info.context may not have META in some contexts
            auth_header = None

        if auth_header:
            masked = auth_header.replace('\n', '')
            # mask long token bodies but keep prefix
            masked = masked.replace('JWT ', 'JWT ').replace('Bearer ', 'Bearer ')
            if len(masked) > 40:
                masked = masked[:30] + '...'
        else:
            masked = None

        print(f"Superuser check - User: {user}, Authenticated: {user.is_authenticated if hasattr(user, 'is_authenticated') else 'N/A'}, HTTP_AUTHORIZATION: {masked}")

        # Check 1: Authentication is mandatory
        if not user or not user.is_authenticated:
            print("Authentication failed - User not authenticated")
            raise PermissionDenied("Authentication is required for this operation.")

        # Check 2: Enforcement of the 'Sole Authorized User' policy
        # NOTE: This is the critical security check. Modify this line
        # based on the definitive attribute (e.g., user.username == 'vista_admin').
        if not user.is_superuser:
            print(f"Authorization failed - User {user.username} is not superuser")
            raise PermissionDenied("Access denied. Only the designated system administrator is authorized.")

        print(f"Access granted for superuser: {user.username}")
        return resolver(root, info, **kwargs)

    return wrapper