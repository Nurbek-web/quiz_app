# Generated by Django 3.2.4 on 2021-06-27 17:04

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('quizes', '0004_remove_quiz_number_of_questions'),
    ]

    operations = [
        migrations.AddField(
            model_name='quiz',
            name='date',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
