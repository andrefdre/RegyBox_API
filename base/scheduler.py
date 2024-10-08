from apscheduler.schedulers.background import BackgroundScheduler
from .enroll_students import enroll_students

def start():
    scheduler = BackgroundScheduler()
    scheduler.add_job(enroll_students, 'interval', seconds=10)
    scheduler.start()
