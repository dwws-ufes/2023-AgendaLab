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

    def __str__(self):
        return super().name

class Department(models.Model):
    name = models.CharField("Name", max_length=200)
    code = models.CharField("Code",max_length=10)

    def __str__(self):
        return self.name

class Laboratory(models.Model):
    num_computers = models.IntegerField("Number of Computers")
    has_blackboard = models.BooleanField("True if it has blackboard")
    created_by = models.ForeignKey(Department,on_delete=models.PROTECT)

    def __str__(self):
        return self.created_by.name

class Scheduling(models.Model):
    active = models.BooleanField()
    repeat = models.BooleanField()
    description = models.CharField(max_length=1000)
    initial_time = models.DateField()
    end_time = models.DateField()
    repeat_until = models.DateField()
