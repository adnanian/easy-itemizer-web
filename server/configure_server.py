#!/usr/bin/env python3
import os
import sys

with open("./server/config.py", encoding='utf-8') as config:
    print(config.read())
print("Read flask config file", flush=True)