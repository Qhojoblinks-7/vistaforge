from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create a router for our API endpoints
router = DefaultRouter()
router.register(r'projects', views.ProjectViewSet, basename='project')
router.register(r'tasks', views.TaskViewSet, basename='task')
router.register(r'milestones', views.MilestoneViewSet, basename='milestone')
router.register(r'contact', views.ContactViewSet, basename='contact')
router.register(r'map-markers', views.MapMarkerViewSet, basename='map-marker')
router.register(r'auth', views.AuthViewSet, basename='auth')

urlpatterns = [
    path('api/', include(router.urls)),
]