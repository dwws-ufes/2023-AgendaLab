from django.db import models

class User(models.Model):
    id = models.IntegerField("ID")
    name = models.CharField("Name", max_length=200)
    email = models.EmailField()
    password = models.CharField("Password", max_length=200)

    def __str__(self):
        return self.email

class Teacher(models.Model):
    register = models.IntegerField("Register")

    def __str__(self):
        return self.email

# class Admin(models.Model):
#
#     def __str__(self):
#         return self.id
