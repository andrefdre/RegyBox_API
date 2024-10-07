from django.contrib import admin
from .models import User, Classes_to_enroll_model

# Register your models here.
admin.site.register(User)
admin.site.register(Classes_to_enroll_model)
