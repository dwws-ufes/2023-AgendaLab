from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

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
    # is_active = models.BooleanField("Active", default=True)
    # is_staff = models.BooleanField("Staff status", default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'

    def __str__(self):
        return self.name

    def is_authenticated(self):
        return True

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
    
    def save(self, *args, **kwargs):
        self.code = self.generate_unique_code()
        super().save(*args, **kwargs)

    # Generate a unique code based on the department code and the number of laboratories
    def generate_unique_code(self):
        code = self.created_by.code
        number = len(Laboratory.objects.filter(created_by=self.created_by))
        code += str(number)
        while Laboratory.objects.filter(code=code).exists():
            number += 1
            code = self.created_by.code + str(number)
        return code

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

    def generate_unique_code(self):
        number = len(Scheduling.objects.all())
        while Scheduling.objects.filter(code=number).exists():
            number += 1
        return number

    def clean(self):
        if self.start_time and self.end_time and self.start_time.time() >= self.end_time.time():
            raise ValidationError("Start time must be before end time")

    def save(self, *args, **kwargs):
        # Assign a unique code to this scheduling
        self.code = self.generate_unique_code()
        # Ensure that initial time and end time are in the same day
        if self.start_time.date() != self.end_time.date():
            raise ValueError("Initial time and end time must be on the same day")
        # Ensure That initial time and end time are between department opening time and closing time
        # if self.start_time.time() < self.laboratory.created_by.opening_time or self.end_time.time() > self.laboratory.created_by.closing_time:
        #     raise ValueError("Initial time and end time must be between department opening time and closing time")
        # if self.start_time.time() < self.laboratory.created_by.opening_time:
        #     raise ValueError("Initial time must be after department opening time")
        # if self.end_time.time() > self.laboratory.created_by.closing_time:
        #     raise ValueError("End time must be before department closing time")

        super().save(*args, **kwargs)
