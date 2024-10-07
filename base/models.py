from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        """Create and return a 'User' with an email and password."""
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)  # Use set_password to hash the password
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """Create and return a superuser with an email and password."""
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        return self.create_user(email, password, **extra_fields)


class Classes_to_enroll_model(models.Model):
    date = models.CharField(max_length=255)
    hour = models.CharField(max_length=255)
    

class User(AbstractBaseUser):
    id = models.AutoField(primary_key=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)

    classes_to_enroll = models.ManyToManyField(Classes_to_enroll_model, related_name='classes_to_enroll', blank=True)

    objects = UserManager()  # Attach the custom manager

    USERNAME_FIELD = 'email'  # Set the email field as the unique identifier
    REQUIRED_FIELDS = []  # Other fields required when creating a superuser

    def __str__(self) -> str:
        return self.email
