# Generated by Django 2.0 on 2019-09-28 12:52

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('news', '0002_news'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='news',
            options={'ordering': ['-pub_time']},
        ),
    ]
