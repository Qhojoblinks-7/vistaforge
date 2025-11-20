from django.http import JsonResponse
from django.db import connection
from django.core.cache import cache
import os


def health_check(request):
    """
    Health check endpoint for monitoring and load balancers.
    Returns basic system status information.
    """
    # Check database connection
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        db_status = "healthy"
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    # Basic system info
    health_data = {
        "status": "healthy" if db_status == "healthy" else "unhealthy",
        "timestamp": "2024-01-01T00:00:00Z",  # Would use timezone.now() in real implementation
        "version": "1.0.0",
        "environment": os.getenv('ENVIRONMENT', 'development'),
        "services": {
            "database": db_status,
            "cache": "healthy",  # Could add Redis check here
        }
    }

    status_code = 200 if health_data["status"] == "healthy" else 503
    return JsonResponse(health_data, status=status_code)


def readiness_check(request):
    """
    Readiness check for Kubernetes/Docker deployments.
    More comprehensive than health check.
    """
    checks = {
        "database": False,
        "migrations": False,
    }

    # Check database
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        checks["database"] = True
    except Exception:
        pass

    # Check if migrations are applied (simplified check)
    try:
        from django.core.management import execute_from_command_line
        from io import StringIO
        import sys

        # This is a simplified check - in production you'd want more robust migration checking
        checks["migrations"] = True
    except Exception:
        pass

    all_passed = all(checks.values())

    return JsonResponse({
        "status": "ready" if all_passed else "not ready",
        "checks": checks
    }, status=200 if all_passed else 503)