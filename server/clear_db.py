#!/usr/bin/env python3
from config import app
from seed import clear_tables

# Server side script to clear all seeded data from the database.
if __name__ == "__main__":
    with app.app_context():
        clear_tables()
