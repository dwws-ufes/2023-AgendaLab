from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
# Register your models here.

from .models import Scheduling, User, Teacher, Admin, Department, Laboratory, PasswordResetCode

# Exclude code from admin interface
class LaboratoryAdmin(admin.ModelAdmin):
    exclude = ['code']

class SchedulingAdmin(admin.ModelAdmin):
    exclude = ['code']

class TeacherAdmin(admin.ModelAdmin):
    exclude = ['last_login']
    def save_model(self, request, obj, form, change):
        # Verifica se a senha foi alterada
        if 'password' in form.changed_data:
            password = form.cleaned_data['password']
            obj.set_password(password)  # Faz o hash da senha
        super().save_model(request, obj, form, change)

class CustomUserAdmin(admin.ModelAdmin):
    exclude = ['last_login']
    def save_model(self, request, obj, form, change):
        # Verifica se a senha foi alterada
        if 'password' in form.changed_data:
            password = form.cleaned_data['password']
            obj.set_password(password)  # Faz o hash da senha
        super().save_model(request, obj, form, change)

admin.site.register(User,CustomUserAdmin)
admin.site.register(Teacher, TeacherAdmin)
# admin.site.register(Admin)
admin.site.register(Department)
admin.site.register(Laboratory, LaboratoryAdmin)
admin.site.register(Scheduling, SchedulingAdmin)
admin.site.register(PasswordResetCode)
