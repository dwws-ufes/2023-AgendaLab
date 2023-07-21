from django.contrib import admin
from django.urls import path, include, re_path
from . import views


urlpatterns = [
    path('', views.home, name='index'),
    path('query', views.query),
    path('all', views.get_all),
    path('books', views.get_books),
    path('upload', views.upload_file, name="upload"),
    re_path(r'^books/([\w/]*)/$', views.get_books_recursive),
    path('<str:subject>', views.get_subject)
]