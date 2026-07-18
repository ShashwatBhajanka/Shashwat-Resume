from django.urls import path
from . import views

urlpatterns = [
    path('', views.home_view, name='home'),
    path('education/', views.education_view, name='education'),
    path('experience/', views.experience_view, name='experience'),
    path('clubs/', views.clubs_view, name='clubs'),
    path('skills/', views.skills_view, name='skills'),
    path('achievements/', views.achievements_view, name='achievements'),
]
