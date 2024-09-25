#!/usr/bin/python3

from Class_API import RegyBox_API

def main():
    api = RegyBox_API()
    print(api.join_class())


if __name__ == "__main__":
    main()