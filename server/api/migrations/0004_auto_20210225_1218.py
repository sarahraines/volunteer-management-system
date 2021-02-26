# Generated by Django 3.1.7 on 2021-02-25 12:18

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_auto_20210225_0501'),
    ]

    operations = [
        migrations.AddField(
            model_name='orgfile',
            name='event',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='api.event'),
        ),
        migrations.AlterField(
            model_name='orgfile',
            name='empty_form',
            field=models.FileField(upload_to=''),
        ),
        migrations.AlterField(
            model_name='userfile',
            name='filled_form',
            field=models.FileField(upload_to=''),
        ),
    ]