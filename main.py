#!/usr/bin/python3

from Class_API import RegyBox_API

# This is the main function
# Box id 148 for Crossfit Feira

def main():
    api = RegyBox_API()
    api.login(148, "andrefdre@gmail.com" , "@ForsakenPT123")
    #print(api.get_classes_for_the_day())
    api.get_classes_for_the_day("2024-10-1")
    #api.join_class("2024-09-27" , 15890)


if __name__ == "__main__":
    main()