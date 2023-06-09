from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from datetime import timedelta
from django.utils import timezone

from .services import serviceHandler as serviceHandler


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser):
    name = models.CharField("Name", max_length=200)
    email = models.EmailField("Email", unique=True)
    recoverCode = serviceHandler.generate_6_digit_code()

    objects = UserManager()

    USERNAME_FIELD = 'email'

    def __str__(self):
        return self.name

class Teacher(User):
    department = models.ForeignKey("Department", on_delete=models.PROTECT, null=True)
    register = models.IntegerField("Register", unique=True)

    def __str__(self):
        return super().name

class Admin(User):
    def __str__(self):
        return super().name

class Department(models.Model):
    code = models.CharField("Code",max_length=10, default="")
    name = models.CharField("Name", max_length=200, default="")
    opening_time = models.TimeField("Opening Time",null=True)
    closing_time = models.TimeField("Closing Time",null=True)

    def save(self, *args, **kwargs):
        # Ensure that opening time is before closing time and that both are in the same day
        if self.opening_time > self.closing_time:
            raise ValueError("Opening time must be before closing time")

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Laboratory(models.Model):
    created_by = models.ForeignKey(Department,on_delete=models.PROTECT)
    code = models.CharField("Code", max_length=20, default="", unique=True, null=True, blank=True)
    num_computers = models.IntegerField("Number of Computers")
    has_blackboard = models.BooleanField("True if it has blackboard")

    # Generate a unique code based on the department code and the number of laboratories
    def generate_unique_code(self, serviceHandler = serviceHandler):
        return serviceHandler.generate_unique_code('Laboratory',self.created_by)

    def save(self, *args, **kwargs):
        self.code = self.generate_unique_code()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.code

class Scheduling(models.Model):
    # Code for this scheduling
    code = models.IntegerField("Code", unique=False, null=True, blank=True)
    # Instances
    laboratory = models.ForeignKey(Laboratory,on_delete=models.CASCADE, null=True)
    created_by = models.ForeignKey(Teacher,on_delete=models.CASCADE, null=True)
    # Scheduling Information
    title = models.CharField(max_length=200,default="")
    description = models.CharField(max_length=1000)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    # Repeated Scheduling
    repeat = models.BooleanField(null=True)

    def generate_unique_code(self, serviceHandler = serviceHandler):
        return serviceHandler.generate_unique_code('Scheduling')

    def clean(self):
        if self.start_time and self.end_time and self.start_time.time() >= self.end_time.time():
            raise ValidationError("Start time must be before end time")

    def save(self,*args, **kwargs):
        # Assign a unique code to this scheduling
        self.code = self.generate_unique_code()
        # Ensure that initial time and end time are in the same day
        if self.start_time.date() != self.end_time.date():
            raise ValueError("Initial time and end time must be on the same day")

        # Dependency Injection of Notification Service

        serviceHandler.notify("Scheduling created successfully")

        super().save(*args, **kwargs)

class PasswordResetCode(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    code = models.IntegerField(default=None, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        current_time = timezone.now()
        return self.created_at + timedelta(minutes=5) < current_time

    def is_valid(self, code):
        return self.code == code and not self.is_expired()

    def delete_if_expired(self):
        if self.is_expired():
            self.delete()

    def refresh_code(self):
        self.code = serviceHandler.generate_6_digit_code()
        self.created_at = timezone.now()
    
    def send_code(self, serviceHandler = serviceHandler):
        serviceHandler.send_email(self.user.email, "<AgendaLab> Recover Code", f"Your recover code: {self.code}")

    def save(self, user: User,*args, **kwargs):
        self.refresh_code()
        self.user = user
        self.send_code()
        super().save(*args, **kwargs)

