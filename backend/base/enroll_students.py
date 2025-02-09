from .models import User
from .password_handling import decrypt_password
from .Regybox_API import RegyBox_API
from datetime import datetime, timedelta
from decouple import config
from django.core.mail import send_mail
from django.conf import settings

def enroll_students():
    users = User.objects.all()
    regybox_api = RegyBox_API()
    SECRET_KEY = config('SECRET_KEY')

    for user in users:
        for class_ in user.classes_to_enroll.all():
            year = int(class_.date.split("-")[0])
            month = int(class_.date.split("-")[1])
            day = int(class_.date.split("-")[2])
            hour = int(class_.hour.split("-")[0].split(":")[0])
            minute = int(class_.hour.split("-")[0].split(":")[1])
            
            # Check if the class is already over
            if datetime(year, month, day, hour, minute) - datetime.now() < timedelta(days=0):
                print(f'Class {class_.date} at {class_.hour} is already over, removing from list')
                user.classes_to_enroll.remove(class_)
                continue

            # Check if the class is within 3 days
            if datetime(year, month, day, hour, minute) - datetime.now() <= timedelta(days=3, hours=1):
                password = decrypt_password(user.password, SECRET_KEY)
                regybox_cookie = regybox_api.login(148, user.email, password)
                
                # Check login success
                if regybox_cookie is None:
                    print(f"Failed to enroll {user.email} in class {class_.date} at {class_.hour}, wasn't able to login to regybox")
                    continue
                
                success = regybox_api.join_class(class_.date, class_.hour, regybox_cookie)

                if success:
                    print(f"Successfully enrolled {user.email} in class {class_.date} at {class_.hour}")
                    user.classes_to_enroll.remove(class_)

                    #Send a notification email
                    send_mail(
                        subject='Class Enrollment Confirmation',
                        message=f'Dear {user.email},\n\nYou have been successfully enrolled in the class on {class_.date} at {class_.hour}.\n\nBest regards,\nYour Team',
                        from_email=settings.EMAIL_HOST_USER,
                        recipient_list=[user.email],
                        fail_silently=False,
                    )
                else:
                    print(f"Failed to enroll {user.email} in class {class_.date} at {class_.hour}")
