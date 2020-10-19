from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
import django.contrib.auth.validators
from django.db import models
from django.db.models import Max
from django.utils.translation import ugettext_lazy as _

class UserManager(BaseUserManager):
    """
    Custom user model manager where email is the unique identifiers
    for authentication instead of usernames.
    """
    def create_user(self, email, password=None, first_name=None, last_name=None, **extra_fields):
        """
        Create and save a User with the given email and password.
        """
        if not email:
            raise ValueError('Enter an email address')
        if not first_name:
            raise ValueError('Enter a first name')
        if not last_name:
            raise ValueError('Enter a last name')
        email = self.normalize_email(email)

        # Find the next valid id for appending to the username
        latest_username = User.objects.filter(first_name__iexact=first_name, last_name__iexact=last_name).aggregate(Max('username'))['username__max']
        num = int(latest_username.split('.')[2]) + 1 if latest_username else 0

        # Create a username for new user in the format first.last.number
        username = "{fname}.{lname}.{num}".format(fname=first_name.lower(), lname=last_name.lower(), num=num)
        user = self.model(email=email, first_name=first_name, last_name=last_name, username=username, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def change_password(self, email, old_password, new_password):
        if not old_password:
            raise ValueError('Enter your old password')
        if not new_password:
            raise ValueError('Enter a new password')
        if old_password != user.password:
            raise ValueError('Old password is incorrect')
        print("raised no exceptions")
        user = User.objects.get(email = data['email'])
        user.update(password = new_password)
        # user.set_password(new_password)
        user.save()
        return user

    def create_superuser(self, email, password, first_name, last_name, **extra_fields):
        """
        Create and save a SuperUser with the given email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        return self.create_user(email=email, password=password, first_name=first_name, last_name=last_name, **extra_fields)


class User(AbstractUser):
    email = models.EmailField(_('email address'), unique=True)
    username = models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    objects = UserManager()