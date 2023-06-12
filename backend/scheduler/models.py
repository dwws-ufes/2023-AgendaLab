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
    code = models.CharField("Code",max_length=10, default="")
    name = models.CharField("Name", max_length=200, default="")
    opening_time = models.TimeField("Opening Time",null=True)
    closing_time = models.TimeField("Closing Time",null=True)

    def save(self, *args, **kwargs):
        # Ensure that opening time is before closing time and that both are in the same day
        if self.opening_time > self.closing_time:
            raise ValueError("Opening time must be before closing time")
        # Ensure that opening time and closing time are in the same day
        if self.opening_time.day != self.closing_time.day:
            raise ValueError("Opening time and closing time must be in the same day")

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
        number = len(Laboratory.objects.all())
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
    laboratory = models.ForeignKey(Laboratory,on_delete=models.PROTECT, null=True)
    created_by = models.ForeignKey(Teacher,on_delete=models.PROTECT, null=True)
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

    def save(self, *args, **kwargs):
        # Assign a unique code to this scheduling
        self.code = self.generate_unique_code()
        # Ensure that initial time and end time are in the same day
        if self.start_time.date() != self.end_time.date():
            raise ValueError("Initial time and end time must be on the same day")
        # Ensure That initial time and end time are between department opening time and closing time
        # if self.start_time.time() < self.laboratory.created_by.opening_time or self.end_time.time() > self.laboratory.created_by.closing_time:
        #     raise ValueError("Initial time and end time must be between department opening time and closing time")

        super().save(*args, **kwargs)
