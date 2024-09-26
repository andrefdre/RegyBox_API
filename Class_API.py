#!/usr/bin/python3

import requests

# https://www.regibox.pt/app/app_nova/php/aulas/marca_aulas.php?id_aula=15890&data=2024-09-27&source=mes&ano=2024&id_rato=552&x=355ae92f6707de54d1da95f0a5de&z=
# id_box 148
# id_user 552
# user 89e15b552bf8145d480faef2491affc8041909b148b5f5c56f

class RegyBox_API:
    def __init__(self):
        self.url = "https://www.regibox.pt/app/app_nova/php"
        self.session = requests.Session()

    def login(self, email, password):
        """
        This function is used to login in the Regybox APP
        :param username: The username of the user
        :param password: The password of the user
        """
        url = self.url + "/login/scripts/verifica_acesso.php?lang=pt"
        data = {
            "id_box": 148,
            "login": email,
            "password" : password
        }
        response = self.session.post(url , data=data)
        if response.status_code == 200:
            return response.json()
        return response.text
    

    def join_class (self):
        """
        This function is used to join a class in the Regybox APP
        :param class_id: The class id in the format "XXXXX"
        :param date: The date of the class in the format "YYYY-MM-DD"
        :param user_id: The user id
            
        """
        url = self.url + "/aulas/marca_aulas.php"
        headers = {
            "Content-Type": "text/html"
        }

        cookies = {
            "regybox_boxes" : "%2A89e15b552bf8145d480faef2491affc8041909b148b5f5c56f", 
            "regybox_user" : "89e15b552bf8145d480faef2491affc8041909b148b5f5c56f",
            "PHPSESSID" : "vvfq71si4g9q7pr6hs31mc3co0"
        }

        params = {
            "id_aula": 15890,
            "data": "2024-09-27",
            "source": "mes",
            "ano": 2024,
            "id_rato": 552,
            "x": "355ae92f6707de54d1da95f0a5de"
            
        }
        response = self.session.get(url , params=params , headers=headers)
        return response.text
    
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
            "regybox_boxes" : "%2A89e15b552bf8145d480faef2491affc8041909b148b5f5c56f", 
            "regybox_user" : "89e15b552bf8145d480faef2491affc8041909b148b5f5c56f",
            "PHPSESSID" : "vvfq71si4g9q7pr6hs31mc3co0"
        }

        params = {
            "id_aula": 15890,
            "data": "2024-09-27",
            "source": "mes",
            "ano": 2024,
            "z": ""
            
        }
        response = self.session.get(url , params=params , headers=headers)
        return response.text

    def get_classes_for_the_day(self):
        """
        This function is used to get the classes of a specific date
        :param date: The date of the class in the format "YYYY-MM-DD"
        """

        url = self.url + "/aulas/aulas.php"
        params = {
            "valor1": 1727262000000,
            "source": "mes",
            "scroll": "s",
            "box": 1,
            "z" : ""
        }
        response = self.session.get(url , params=params)
        return response.text
    
    def get_class_info(self, class_id):
        """
        This function is used to get the info of a specific class
        :param class_id: The class id in the format "XXXXX"
        """

        url = self.url + "/aulas/detalhes_aula.php"
        params = {
            "time": 1727285754.782,
            "valor2": 2024,
            "valor3": 15888,
            "valor4": "2024-09-27",
            "source": "mes"
        }
        response = self.session.get(url , params=params)
        return response.text

