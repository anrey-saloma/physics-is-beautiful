# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2018-02-27 10:04
from __future__ import unicode_literals

from django.db import migrations, models
import django_light_enums.db


class Migration(migrations.Migration):

    dependencies = [
        ('curricula', '0018_auto_20180201_1211'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='question',
            name='additional_text',
        ),
        migrations.AlterField(
            model_name='answer',
            name='is_correct',
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name='lesson',
            name='lesson_type',
            field=django_light_enums.db.EnumField(choices=[(0, 'DEFAULT'), (1, 'GAME')], default=0, enum_values=(0, 1)),
        ),
        migrations.AlterField(
            model_name='lessonprogress',
            name='status',
            field=django_light_enums.db.EnumField(choices=[(0, 'LOCKED'), (10, 'NEW'), (20, 'UNLOCKED'), (30, 'COMPLETE')], default=0, enum_values=(0, 10, 20, 30)),
        ),
        migrations.AlterField(
            model_name='question',
            name='answer_type',
            field=django_light_enums.db.EnumField(choices=[(0, 'UNDEFINED'), (50, 'MATHEMATICAL_EXPRESSION'), (20, 'VECTOR'), (30, 'NULLABLE_VECTOR'), (70, 'UNIT_CONVERSION'), (40, 'IMAGE'), (100, 'MULTIPLE_CHOICE'), (10, 'TEXT'), (60, 'VECTOR_COMPONENTS'), (110, 'MULTISELECT_CHOICE')], default=0, enum_values=(0, 50, 20, 30, 70, 40, 100, 10, 60, 110)),
        ),
        migrations.AlterField(
            model_name='question',
            name='question_type',
            field=django_light_enums.db.EnumField(blank=True, choices=[(40, 'MULTISELECT_CHOICE'), (0, 'UNDEFINED'), (10, 'SINGLE_ANSWER'), (20, 'MULTIPLE_CHOICE')], default=0, enum_values=(40, 0, 10, 20), null=True),
        ),
    ]
