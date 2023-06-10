from django.db import models

class User(models.Model):
    name = models.CharField("Name", max_length=200)
    email = models.EmailField()
    password = models.CharField("Password", max_length=200)

    def __str__(self):
        return self.name

class Teacher(User):
    register = models.IntegerField("Register")

    def __str__(self):
        return super().name

class Admin(User):

    def approve_scheduling(self, scheduling):
        scheduling.active = True
        scheduling.save()

    def __str__(self):
        return super().name

class Department(models.Model):
    code = models.CharField("Code",max_length=10,primary_key=True)
    name = models.CharField("Name", max_length=200)
    opening_time = models.TimeField("Opening Time")
    closing_time = models.TimeField("Closing Time")

    def save(self, *args, **kwargs):
        # Ensure that opening time is before closing time and that both are in the same day
        if self.opening_time > self.closing_time:
            raise ValueError("Opening time must be before closing time")
        # Ensure that opening time and closing time are in the same day
        if self.opening_time.day != self.closing_time.day:
            raise ValueError("Opening time and closing time must be in the same day")

        super(Department, self).save(*args, **kwargs)

    def __str__(self):
        return self.name

class Laboratory(models.Model):
    code = models.CharField("Code", max_length=20, primary_key=True)
    num_computers = models.IntegerField("Number of Computers")
    has_blackboard = models.BooleanField("True if it has blackboard")
    created_by = models.ForeignKey(Department,on_delete=models.PROTECT)
    
    # Initialize the code of the laboratory
    def __init__(self):
        self.code = self.generate_unique_code()

    # Generate a unique code based on the department code and the number of laboratories
    def generate_unique_code(self):
        code = self.created_by.code
        number = len(Laboratory.objects.all())
        code += str(number)
        return code

    def __str__(self):
        return self.created_by.name

class Scheduling(models.Model):
    active = models.BooleanField(null=True)
    repeat = models.BooleanField(null=True)
    description = models.CharField(max_length=1000)
    initial_time = models.DateField()
    end_time = models.DateField()
    repeat_until = models.DateField(null=True)
