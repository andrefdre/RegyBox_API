# Generated by Django 4.2.16 on 2024-10-06 21:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0009_classes_to_enroll_model_and_more'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Token',
        ),
        migrations.AddField(
            model_name='user',
            name='classes_to_enroll',
            field=models.ManyToManyField(blank=True, related_name='classes_to_enroll', to='base.classes_to_enroll_model'),
        ),
    ]
