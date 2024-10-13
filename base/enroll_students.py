from .models import User
from .password_handling import decrypt_password
from .Regybox_API import RegyBox_API
from datetime import datetime , timedelta
from decouple import config


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
            if datetime(year, month, day, hour, minute) - datetime.now() < timedelta(days=0):
                print(f'Class {class_.date} at {class_.hour} is already over, removing from list')
                user.classes_to_enroll.remove(class_)
            if datetime(year, month, day, hour, minute) - datetime.now() <= timedelta(days=3, hours=1):
                password = decrypt_password(user.password, SECRET_KEY)
                regybox_cookie = regybox_api.login(148, user.email, password)
                # Checks if it was able to login to regybox platform
                if regybox_cookie is None:
                    print(f"Failed to enroll {user.email} in class {class_.date} at {class_.hour}, wasn't able to login to regybox")
                    continue
                success = regybox_api.join_class(class_.date, class_.hour, regybox_cookie)

                if success:
                    print(f"Successfully enrolled {user.email} in class {class_.date} at {class_.hour}")
                    user.classes_to_enroll.remove(class_)
                else:
                    print(f"Failed to enroll {user.email} in class {class_.date} at {class_.hour}")
