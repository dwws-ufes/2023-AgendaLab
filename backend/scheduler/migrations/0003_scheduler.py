# Generated by Django 4.2.1 on 2023-06-08 19:56

from django.db import migrations
from datetime import date

def create_data(apps,schema_editor):
    Teacher = apps.get_model('scheduler', 'Teacher')
    Admin = apps.get_model('scheduler', 'Admin')
    Department = apps.get_model('scheduler','Department')
    Laboratory = apps.get_model('scheduler','Laboratory')
    Scheduling = apps.get_model('scheduler','Scheduling')

    Teacher(name="Joao Mili", email="joaoMili@meu_email.com", password="teste123", register="202301").save()
    Teacher(name="Cris Scarpatdesa", email="cris@meu_email.com", password="teste987", register="202302").save()

    Admin(name="Hiuri Carriço", email="hiuri@meu_email.com", password="admin").save()

    Department(code="INF", name="Informatica", opening_time="08:00:00", closing_time="22:00:00").save()

    Laboratory(num_computers=20, has_blackboard=True, created_by=Department.objects.get(code="INF")).save()

    # Unique Scheduling
    Scheduling(teacher=Teacher.objects.get(register="202301"),
               laboratory=Laboratory.objects.get(code="INF"),
               description="First unique scheduling",
               start_time='2023-06-12 12:00:00',
               end_time='2023-06-12 14:00:00').save()


    # Unique Scheduling
    Scheduling(created_by=Teacher.objects.get(register="202301"),
               laboratory=Laboratory.objects.get(code="INF"),
               description="Second unique scheduling",
               start_time='2023-06-12 17:00:00',
               end_time='2023-06-12 19:00:00',
               repeat=False).save()

    

class Migration(migrations.Migration):

    dependencies = [
        ('scheduler', '0002_alter_department_code'),
    ]

    operations = [
        migrations.RunPython(create_data),
    ]
