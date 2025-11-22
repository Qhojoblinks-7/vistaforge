"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from graphene_django.views import GraphQLView
from django.views.decorators.csrf import csrf_exempt
from graphql_jwt.decorators import jwt_cookie
from admin_security.admin_config import exclusive_admin_site
from .schema import schema
from . import views

urlpatterns = [
    # Health checks for monitoring and load balancers
    path('health/', views.health_check, name='health_check'),
    path('readiness/', views.readiness_check, name='readiness_check'),

    # Admin URLs
    path('admin/login/', exclusive_admin_site.urls),
    path('admin/', admin.site.urls),  # Fallback admin URL

    # GraphQL API
    # Accept both with and without trailing slash so POST requests from
    # clients that omit the trailing slash won't trigger APPEND_SLASH redirects
    # (which cannot preserve POST data).
    path('graphql/', jwt_cookie(csrf_exempt(GraphQLView.as_view(
        graphiql=True,
        schema=schema
    )))),
    path('graphql', jwt_cookie(csrf_exempt(GraphQLView.as_view(
        graphiql=True,
        schema=schema
    )))),
]
