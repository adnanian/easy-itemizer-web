#!/usr/bin/env python3
import os
import sys

with open("./client/vite.config.js", encoding='utf-8') as vite_config:
    print(vite_config.read())
print("Read vite file", flush=True)
sys.stdout.flush()