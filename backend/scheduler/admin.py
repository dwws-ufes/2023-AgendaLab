from django.contrib import admin

# Register your models here.

from .models import Scheduling, User, Teacher, Admin, Department, Laboratory

# Exclude code from admin interface
class LaboratoryAdmin(admin.ModelAdmin):
    exclude = ['code']

class SchedulingAdmin(admin.ModelAdmin):
    exclude = ['code']

class UserAdmin(admin.ModelAdmin):
    exclude = ['last_login']

admin.site.register(User,UserAdmin)
admin.site.register(Teacher)
admin.site.register(Admin)
admin.site.register(Department)
admin.site.register(Laboratory, LaboratoryAdmin)
admin.site.register(Scheduling, SchedulingAdmin)
