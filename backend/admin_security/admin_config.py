from django.contrib.admin import AdminSite
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()

class ExclusiveAdminSite(AdminSite):
    """
    A custom AdminSite that enforces access only for a single, pre-defined
    exclusive administrator, overriding standard permissions.
    """
    site_header = "VistaForge Exclusive Administration"
    site_title = "VistaForge Admin Portal"

    def has_permission(self, request):
        """
        Overrides the standard permission check to enforce RLS based on
        the EXCLUSIVE_ADMIN_USERNAME setting.
        """
        # Ensure the setting exists and is non-empty
        exclusive_username = getattr(settings, 'EXCLUSIVE_ADMIN_USERNAME', None)

        # 1. Standard Django Admin Requirement
        if not request.user.is_active:
            return False

        # 2. Exclusive Check (The RLS/Permission Override)
        if exclusive_username and request.user.username == exclusive_username:
            # The one and only exclusive admin is allowed.
            return True

        # 3. Deny all others, even if they are superusers or staff.
        return False

# Instantiate the custom admin site
exclusive_admin_site = ExclusiveAdminSite(name='exclusive_admin')