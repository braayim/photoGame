# Generated by Django 2.1 on 2018-08-11 13:01

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('photos', '0009_auto_20180811_1252'),
    ]

    operations = [
        migrations.AlterField(
            model_name='images',
            name='image',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='photos.Picture'),
        ),
    ]
