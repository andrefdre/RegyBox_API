#!/usr/bin/python3

import requests
from bs4 import BeautifulSoup
import datetime
import time

# https://www.regibox.pt/app/app_nova/php/aulas/marca_aulas.php?id_aula=15890&data=2024-09-27&source=mes&ano=2024&id_rato=552&x=355ae92f6707de54d1da95f0a5de&z=
# id_box 148
# id_user 552
# user 89e15b552bf8145d480faef2491affc8041909b148b5f5c56f

class RegyBox_API:
    def __init__(self):
        self.url = "https://www.regibox.pt/app/app_nova/php"
        self.session = requests.Session()
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

    def login(self, box_id , email, password):
        """
        This function is used to login in the Regybox APP
        :param email: The email of the user
        :param password: The password of the user
        """
        url = self.url + "/login/scripts/verifica_acesso.php?lang=pt"
        data = {
            "id_box": box_id,
            "login": email,
            "password" : password
        }
        response = self.session.post(url , data=data)
        if response.status_code == 200:
            self.regybox_user_cookie = response.text.split("&")[0].split("=")[2]
            return self.regybox_user_cookie
        
    

    def join_class (self, date, id_aula):
        """
        This function is used to join a class in the Regybox APP
        :param class_id: The class id in the format "XXXXX"
        :param date: The date of the class in the format "YYYY-MM-DD"
        :param user_id: The user id
            
        """
        class_info = self.get_class_info(date, id_aula)
        if class_info[1][0] == "Workout-of-the-day":
            print (f"The pretended class on the day {class_info[2]} at {class_info[3]} already occurred")
            return 
        
        print(f"The pretended class on the day {class_info[2]} at {class_info[3]} has {class_info[0]} people enroled")
        if class_info[0] <= 16:
            url = self.url + "/aulas/marca_aulas.php"
    
            cookies = {
                "regybox_user" : self.regybox_user_cookie,
            }

            params = {
                "id_aula": id_aula,
                "data": date,
                "source": "mes",
                "ano": datetime.now().year,
                "id_rato": 552,
                "x": "355ae92f6707de54d1da95f0a5de"
                
            }
            response = self.session.get(url , params=params , cookies=cookies)
            print(response.text)
        else:
            print("Class is full")
            return 
    
    def remove_class (self):
        """
        This function is used to remove a class in the Regybox APP
        :param class_id: The class id in the format "XXXXX"
        :param date: The date of the class in the format "YYYY-MM-DD"
        :param user_id: The user id
            
        """
        url = self.url + "/aulas/marca_aulas.php"
        headers = {
            "Content-Type": "text/html"
        }

        cookies = {
            "regybox_user" : self.regybox_user_cookie,
        }

        params = {
            "id_aula": 15890,
            "data": "2024-09-27",
            "source": "mes",
            "ano": 2024,
            "id_rato": 552,
            "z": ""
            
        }
        response = self.session.get(url , params=params , headers=headers)
        return response.text

    def get_classes_for_the_day(self,date):
        """
        This function is used to get the classes of a specific date
        :param date: The date of the class in the format "YYYY-MM-DD"
        """
        year, month, day = date.split("-")
        date_time = datetime.datetime(int(year), int(month), int(day), 11, 00)
        unix_time = int(time.mktime(date_time.timetuple()))*1000
        print(unix_time)
        url = self.url + "/aulas/aulas.php"
        params = {
            "valor1": unix_time,
            "source": "mes",
            "scroll": "s",
            "box": 1,
            "z" : ""
        }

        cookies = {
            "regybox_user" : self.regybox_user_cookie,
        }
        response = self.session.get(url , params=params , cookies=cookies)
        soup =BeautifulSoup(response.text, "html.parser")
        # Part of the code that will confirm if the requested date is the same as the received date
        date_confirmation = soup.find_all("div")[0].string.strip()
        _ , day_confirmation , _ , month_confirmation , _ , year_confirmation = date_confirmation.split(" ")

        for loop_month in self.monthh_dict:
            if month_confirmation == loop_month:
                month_confirmation = self.monthh_dict[loop_month]
                break

        if not (day == day_confirmation and int(month) == month_confirmation and year == year_confirmation):
            print(f"Error, the date {date} is not the same as the date {year_confirmation}-{month_confirmation}-{day_confirmation}")
            return


        print(f"Classes for the day {year}-{month}-{day}")
    
    def get_class_info(self, date , class_number):
        """
        This function is used to get the info of a specific class
        :param class_id: The class id in the format "XXXXX"
        """

        url = self.url + "/aulas/detalhes_aula.php"
        params = {
            "valor2": datetime.now().year,
            "valor3": class_number,
            "valor4": date,
            "source": "mes"
        }

        cookies = {
            "regybox_user" : self.regybox_user_cookie,
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

