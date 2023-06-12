# Generated by Django 4.2.1 on 2023-06-12 22:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scheduler', '0004_rename_initial_time_scheduling_start_time_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='scheduling',
            name='active',
        ),
        migrations.RemoveField(
            model_name='scheduling',
            name='repeat_until',
        ),
        migrations.AddField(
            model_name='scheduling',
            name='code',
            field=models.CharField(default='', max_length=20, verbose_name='Code'),
        ),
        migrations.AddField(
            model_name='scheduling',
            name='title',
            field=models.CharField(default='', max_length=200),
        ),
        migrations.AlterField(
            model_name='scheduling',
            name='end_time',
            field=models.DateTimeField(),
        ),
        migrations.AlterField(
            model_name='scheduling',
            name='start_time',
            field=models.DateTimeField(),
        ),
    ]
