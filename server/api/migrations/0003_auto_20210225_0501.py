# Generated by Django 3.1.7 on 2021-02-25 05:01

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20210225_0411'),
    ]

    operations = [
        migrations.AlterField(
            model_name='faq',
            name='org_id',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='api.organization'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='organization',
            name='address',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='organization',
            name='email',
            field=models.EmailField(blank=True, max_length=256, null=True),
        ),
        migrations.AlterField(
            model_name='organization',
            name='phone',
            field=models.CharField(blank=True, max_length=32, null=True),
        ),
        migrations.AlterField(
            model_name='organization',
            name='website',
            field=models.CharField(blank=True, max_length=256, null=True),
        ),
    ]