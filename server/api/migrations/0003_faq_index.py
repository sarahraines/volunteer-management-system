# Generated by Django 3.1.2 on 2020-11-02 00:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_faq'),
    ]

    operations = [
        migrations.AddField(
            model_name='faq',
            name='index',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
    ]