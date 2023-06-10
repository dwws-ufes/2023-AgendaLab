from django.urls import path, re_path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    re_path(r'^api/scheduler/$', views.schedules_list),
    re_path(r'^api/scheduler/([0-9])$', views.schedules_detail),
    re_path(r'^api/teacher/$', views.teachers_list),
    re_path(r'^api/teacher/([0-9])$', views.teachers_detail),
    re_path(r'^api/admin/$', views.admins_list),
    re_path(r'^api/admin/([0-9])$', views.admins_detail),
    re_path(r'^api/department/$', views.departments_list),
    re_path(r'^api/department/([0-9])$', views.departments_detail),
    re_path(r'^api/laboratory/$', views.laboratories_list),
    re_path(r'^api/laboratory/([0-9])$', views.laboratories_detail),
]
