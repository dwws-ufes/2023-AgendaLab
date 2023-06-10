from django.db import models

# Generatea unique code like, if the code of department class is INF, the code generated by a Laboratory object will loop through object len and assign a value correspondent to his position like the 4th lab will be INF04
    
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

    def __str__(self):
        return super().name

class Department(models.Model):
    code = models.CharField("Code",max_length=10,primary_key=True)
    name = models.CharField("Name", max_length=200)

    def __str__(self):
        return self.name

class Laboratory(models.Model):
    code = models.CharField("Code", max_length=20, primary_key=True)
    num_computers = models.IntegerField("Number of Computers")
    has_blackboard = models.BooleanField("True if it has blackboard")
    created_by = models.ForeignKey(Department,on_delete=models.PROTECT)
    
    def __init__(self):
        self.code = self.generate_unique_code()

    def generate_unique_code(self):
        code = str(self.created_by)
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
