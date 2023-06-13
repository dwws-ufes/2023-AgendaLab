# Generated by Django 4.2.1 on 2023-06-13 01:19

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('scheduler', '0005_remove_scheduling_active_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='teacher',
            name='department',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='scheduler.department'),
        ),
        migrations.AlterField(
            model_name='laboratory',
            name='code',
            field=models.CharField(blank=True, default='', max_length=20, null=True, unique=True, verbose_name='Code'),
        ),
        migrations.AlterField(
            model_name='scheduling',
            name='code',
            field=models.IntegerField(blank=True, null=True, verbose_name='Code'),
        ),
        migrations.AlterField(
            model_name='scheduling',
            name='created_by',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='scheduler.teacher'),
        ),
        migrations.AlterField(
            model_name='scheduling',
            name='laboratory',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='scheduler.laboratory'),
        ),
    ]
