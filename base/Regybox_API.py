#!/usr/bin/python3

import re
import requests
from bs4 import BeautifulSoup
from datetime import datetime
import time


class RegyBox_API:
    def __init__(self):
        self.url = "https://www.regibox.pt/app/app_nova/php"
        self.session = requests.Session()
        # Dictionary to convert the month to a number
        self.monthh_dict = {
            "Janeiro": 1,
            "Fevereiro": 2,
            "Março": 3,
            "Abril": 4,
            "Maio": 5,
            "Junho": 6,
            "Julho": 7,
            "Agosto": 8,
            "Setembro": 9,
            "Outubro": 10,
            "Novembro": 11,
            "Dezembro": 12
        }

        self.class_time_array = [
            "07:00 - 07:45",
            "08:00 - 08:45",
            "10:00 - 10:45",
            "12:15 - 13:00",
            "16:30 - 17:30",
            "17:30 - 18:30",
            "18:30 - 19:30",
            "19:30 - 20:30"
        ]

        self.class_time_array_weekend = [
            "08:00 - 09:00",
            "09:00 - 10:00",
            "10:00 - 11:00",
        ]

    def login(self, box_id , email, password):
        """
        This function is used to login in the Regybox APP
        :param box_id: The box id
        :param email: The email of the user
        :param password: The password of the user
        """
        url = self.url + "/login/scripts/verifica_acesso.php?lang=pt"
        data = {
            "id_box": box_id,
            "login": email,
            "password" : password
        }
        try:
            response = self.session.post(url , data=data)
        except:
            return None
  
        if response.text.find("Acesso negado") != -1:
            return None
        if response.status_code == 200:
            self.regybox_user_cookie = response.text.split("&")[0].split("=")[2]
            print(response.text)
            return self.regybox_user_cookie
        else:
            return None
        
    

    def join_class (self, date, hour, cookie = None):
        """
        This function is used to join a class in the Regybox APP
        :param date: The date of the class in the format "YYYY-MM-DD"
        :param hour: The hour of the class in the format "HH:MM"
        :param cookie: The cookie of the user logged in (note necessary if the function login was used)
        """
        # Get classes of the day to extract information
        [date, classes_of_the_day] = self.get_classes_for_the_day(date, cookie = cookie)

        # Get the class id
        for class_info in classes_of_the_day:
            if class_info["time"] == hour:
                id_aula = class_info["class_id"]
                x = class_info["x"]
                break
        else:
            print("Class not found")
            return

        # Get class info
        class_info = self.get_class_info(date, id_aula, cookie=cookie)

        if len(class_info[1]) < 1:
            return False
        if class_info[1][0] == "Workout-of-the-day":
            print (f"The pretended class on the day {class_info[2]} at {class_info[3]} already occurred")
            return False
        
        print(f"The pretended class on the day {class_info[2]} at {class_info[3]} has {class_info[0]} people enroled")
        if class_info[0] <= 16:
            url = self.url + "/aulas/marca_aulas.php"
    
            if cookie == None:
                cookies = {
                    "regybox_user" : self.regybox_user_cookie,
                }
            else:
                cookies = {
                    "regybox_user" : cookie,
                }

            params = {
                "id_aula": id_aula,
                "data": date,
                "source": "mes",
                "ano": datetime.now().year,
                "id_rato": 552,
                "x": x
                
            }
            response = self.session.get(url , params=params , cookies=cookies)
            if response.status_code == 200:
                return True
        else:
            print("Class is full")
            return  False
    
    def remove_class (self ,date , id_aula, cookie = None):
        """
        This function is used to remove a class in the Regybox APP
        :param date: The date of the class in the format "YYYY-MM-DD"
        :param id_aula: The id of the class
        :param cookie: The cookie of the user logged in (note necessary if the function login was used)
            
        """
        url = self.url + "/aulas/marca_aulas.php"
        headers = {
            "Content-Type": "text/html"
        }

        if cookie == None:
            cookies = {
                "regybox_user" : self.regybox_user_cookie,
            }
        else:
            cookies = {
                "regybox_user" : cookie,
            }

        params = {
            "id_aula": id_aula,
            "data": date,
            "source": "mes",
            "ano": 2024,
            "id_rato": 552,
            "z": ""
            
        }
        response = self.session.get(url , params=params , cookies=cookies)
        return response.text

    def get_classes_for_the_day(self,date , cookie = None):
        """
        This function is used to get the classes of a specific date
        :param date: The date of the class in the format "YYYY-MM-DD"
        :param cookie: The cookie of the user logged in (note necessary if the function login was used)
        """

        # Get the unix time of the date
        year, month, day = date.split("-")
        date_time = datetime(int(year), int(month), int(day), 11, 00)
        unix_time = int(time.mktime(date_time.timetuple()))*1000
 
        url = self.url + "/aulas/aulas.php"

        params = {
            "valor1": unix_time,
            "source": "mes",
            "scroll": "s",
            "box": 1,
            "z" : ""
        }

        if cookie == None:
            cookies = {
                "regybox_user" : self.regybox_user_cookie,
            }
        else:
            cookies = {
                "regybox_user" : cookie,
            }
        try:
            response = self.session.get(url , params=params , cookies=cookies)
        except:
            return None , []
        
        soup =BeautifulSoup(response.text, "html.parser")

        # Checks if it was able to retrieve the classes
        if soup.find_all("div") == []:
            return None , []

        # Part of the code that will confirm if the requested date is the same as the received date
        date_confirmation = soup.find_all("div")[0].string.strip()
        _ , day_confirmation , _ , month_confirmation , _ , year_confirmation = date_confirmation.split(" ")

        for loop_month in self.monthh_dict:
            if month_confirmation == loop_month:
                month_confirmation = self.monthh_dict[loop_month]
                break

        if not (int(day) == int(day_confirmation) and int(month) == int(month_confirmation) and int(year) == int(year_confirmation)):
            print(f"Error, the date {date} is not the same as the date {year_confirmation}-{month_confirmation}-{day_confirmation}")
            return None , []
        # Extract the classes of the day

  
        # This bit of the code checks if the requested day is weekend or not and returns the respective array of classes schedules. This is necessary since Crossfit Feira has different times for weekdays and weekends
        if date_time.weekday() < 5:
            class_time_array = self.class_time_array
        else:
            class_time_array = self.class_time_array_weekend

        classes_of_the_day= []
        # Gets the classes of the day
        for class_time in class_time_array:
            for class_info in soup.find_all('div',string=re.compile(class_time)):
                time_of_class = class_info.string
                students_in_class , _ , total_students_allowed = class_info.find_next("div").string.split(" ")
                if class_info.find_next("div").find_next("div").find("button") != None and int(students_in_class) < int(total_students_allowed):
                    can_join_class = True
                    class_id = class_info.find_next("div").find_next("div").find("button").attrs["onclick"].split("?")[2].split("&")[0].split("=")[1]
                    try:
                        x = class_info.find_next("div").find_next("div").find("button").attrs["onclick"].split("?")[2].split("&")[5].split("=")[1].split("'")[0]
                    except:
                        x = None
                else:
                    can_join_class = False
                    class_id = None
                    x = None
                class_information_structure = {
                    "time": time_of_class,
                    "students_in_class": students_in_class,
                    "total_students": total_students_allowed,
                    "can_join_class": can_join_class,
                    "class_id": class_id,
                    "x": x
                }
                #print(class_information_structure)
                classes_of_the_day.append(class_information_structure)
        # If no classes are returned it could mean you are looking to far ahead so we will fill the array with empty classes so the user can still choose to join the classe
        if len(classes_of_the_day) == 0:
            # Checks if it's sunday since no classes that day
            if date_time.weekday() < 6:
                for class_time in class_time_array:
                    class_information_structure = {
                        "time": class_time,
                        "students_in_class": 0,
                        "total_students": 0,
                        "can_join_class": False,
                        "class_id": None,
                        "x": None
                    }
                    classes_of_the_day.append(class_information_structure)
        return [date,  classes_of_the_day]

    
    def get_class_info(self, date , class_number, cookie = None):
        """
        This function is used to get the info of a specific class
        :param date: The date of the class in the format "YYYY-MM-DD"
        :param class_number: The number of the class
        :param cookie: The cookie of the user logged in (note necessary if the function login was used)
        """

        url = self.url + "/aulas/detalhes_aula.php"
        params = {
            "valor2": datetime.now().year,
            "valor3": class_number,
            "valor4": date,
            "source": "mes"
        }

        if cookie == None:
            cookies = {
                "regybox_user" : self.regybox_user_cookie,
            }
        else:
            cookies = {
                "regybox_user" : cookie,
            }


        response = self.session.get(url , params=params , cookies=cookies)
        if response.status_code != 200:
            print("Error")
            return
        soup =BeautifulSoup(response.text, "html.parser")
        class_date = soup.find_all("div", attrs={ "align":"left" , "class":"col"})[0].string.strip()
        class_hour = soup.find_all("div", attrs={"align":"right" , "class":"col"})[0].string.strip()
        total_enroled = len(soup.find_all("li"))
        enroled_people_div = soup.find_all(class_ = "item-title")
        enroled_people = []
        for people in enroled_people_div:
            enroled_people.append(people.string.strip())
        return [total_enroled, enroled_people, class_date, class_hour]
    
    def get_enrolled_classes(self, cookie = None):
        """
        This function is used to get the classes that the user is enrolled
        :param cookie: The cookie of the user logged in (note necessary if the function login was used)
        """
        url = "https://www.regibox.pt/app/app_nova/index.php?ignore=regibox.pt/app/app_nova/"
        params = {
            "source": "mes"
        }

        if cookie == None:
            cookies = {
                "regybox_user" : self.regybox_user_cookie,
            }
        else:
            cookies = {
                "regybox_user" : cookie,
            }

        response = self.session.get(url , params=params , cookies=cookies)
        if response.status_code != 200:
            print("Error")
            return
        soup =BeautifulSoup(response.text, "html.parser")
        classes = []
        for class_info in soup.find_all("div", attrs={"class":"item-title"}):
            classes.append(class_info.string.strip())
        return classes

