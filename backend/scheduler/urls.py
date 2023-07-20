from django.urls import path, re_path
from django.contrib import admin
from . import views

urlpatterns = [
    path('', views.get_routes), # Default Route values
    path('request/', views.get_routes), # Default Route values
    path('request/schedule/', views.schedules_list),
    path('request/schedule/create/', views.make_scheduling),
    path('request/schedule/<int:pk>/', views.schedules_detail),
    path('request/teacher/', views.teachers_list),
    path('request/teacher/<int:pk>/', views.teachers_detail),
    path('request/admin/', views.admins_list),
    path('request/admin/<int:pk>/', views.admins_detail),
    path('request/department/', views.departments_list),
    path('request/department/<int:pk>/', views.departments_detail),
    path('request/laboratory/', views.laboratories_list),
    path('request/laboratory/<int:pk>/', views.laboratories_detail),
    path('request/user/', views.users_list),
    path('request/user/<int:pk>/', views.users_detail),
    # path('request/user/<int:pk>/send_code/',views.send_code),
    path('request/user/<str:email>/<int:code>/',views.reset_password),
    path('request/user/<str:email>/send_code/',views.send_code),
    path('request/login/',views.login),
    path('request/logout/',views.logout),
    path('request/buildRDF/',views.buildRDF),
]
