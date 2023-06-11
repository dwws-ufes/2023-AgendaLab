from django.urls import path, re_path
from django.contrib import admin
from . import views

urlpatterns = [
    path('', views.get_routes), # Default Route values
    path('request/', views.get_routes), # Default Route values
    path('request/schedule/', views.schedules_list),
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
    # re_path(r'^api/scheduler/$', views.schedules_list),
    # re_path(r'^api/scheduler/([0-9])$', views.schedules_detail),
    # re_path(r'^api/teacher/$', views.teachers_list),
    # re_path(r'^api/teacher/([0-9])$', views.teachers_detail),
    # re_path(r'^api/admin/$', views.admins_list),
    # re_path(r'^api/admin/([0-9])$', views.admins_detail),
    # re_path(r'^api/department/$', views.departments_list),
    # re_path(r'^api/department/([0-9])$', views.departments_detail),
    # re_path(r'^api/laboratory/$', views.laboratories_list),
    # re_path(r'^api/laboratory/([0-9])$', views.laboratories_detail),
    # re_path(r'^api/user/$', views.users_list),
    # re_path(r'^api/user/([0-9])$', views.users_detail),
]
