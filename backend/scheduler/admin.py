from django.contrib import admin

# Register your models here.

from .models import Scheduling, User, Teacher, Admin, Department, Laboratory

admin.site.register(User)
admin.site.register(Teacher)
admin.site.register(Admin)
admin.site.register(Department)
admin.site.register(Laboratory)
admin.site.register(Scheduling)

