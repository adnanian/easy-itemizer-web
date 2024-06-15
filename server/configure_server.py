#!/usr/bin/env python3
import os
import sys

config_type = ""
with open("./configType.txt", encoding="utf-8") as mode:
    config_type = mode.read()

with open("./server/config.py", encoding='utf-8') as config:
    data = config.read().split('\n')
    print(data)
    if (config_type.lower() == "development"):
        print("Configuring for development.")
    elif (config_type.lower() == "production"):
        print("Configuring for production.")
    else:
        raise ValueError("Invalid configuration type entered.")