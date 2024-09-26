#!/usr/bin/python3

from Class_API import RegyBox_API

def main():
    api = RegyBox_API()
    print(api.login("andrefdre@gmail.com", "@ForsakenPT123"))


if __name__ == "__main__":
    main()