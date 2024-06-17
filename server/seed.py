#!/usr/bin/env python3

from config import app, db
from models.models import *
from faker import Faker
from helpers import (
    print_starting_seed,
    println_starting_seed,
    print_ending_seed,
    print_progress,
    execute_to_success,
    RoleType
)
import random
import time

# import traceback

fake = Faker()

USER_SEED_SIZE = 20
""" Number of users that will be generated."""

MIN_USERNAME_LENGTH = 8
"""Usernames must be at least eight characters in length."""

DEFAULT_NUMBER_LENGTH = int(MIN_USERNAME_LENGTH / 2)
"""
  Each username will have a certain number of digits after their first initial and last name.
  The default is 4, but may have more digits if the user's name is too short.
"""

ITEM_SEED_SIZE = 30
"""Number of items that will be generated. See seeds/item_seed.py"""

ORG_SEED_SIZE = 11
"""Number of organizations that will be generated."""

MAX_COUNT = 70
"""Maximum current quantity of an assigned item for the seed."""

REQUEST_SEED_LIMIT = 25
""" Maximum number of requests that will be generated per organization.
    This is only for the seed. This limit is not applied in actual run time of
    the web application.
"""

PASSWORD = "Green+1234"
"""All seeded users will have the same password for the purposes of testing this application in the development phase."""

ATTEMPT_LIMIT = 5
"""The number of times that the execute_to_success helper function will execute."""

ITEM_SEED = {
    "Ergonomic Rubber Bike": {
        "description": "A bike with an ergonomic design and rubber tires.",
        "image_url": "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=2022&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D.jpg",
    },
    "Granite Computer": {
        "description": "A computer made with granite material.",
        "image_url": "https://cdn.pixabay.com/photo/2019/11/03/08/32/tablet-4598088_1280.jpg",
    },
    "Shirt": {
        "description": "A piece of clothing that covers the upper body.",
        "image_url": "https://cdn.pixabay.com/photo/2016/03/25/09/04/t-shirt-1278404_1280.jpg",
    },
    "Rustic Mouse": {
        "description": "A computer mouse with a rustic design.",
        "image_url": "https://cdn.pixabay.com/photo/2017/05/24/21/33/workplace-2341642_1280.jpg",
    },
    "Refined Soft Tuna": {
        "description": "High-quality and soft tuna.",
        "image_url": "https://cdn.pixabay.com/photo/2014/09/08/22/50/tuna-439755_1280.jpg",
    },
    "Practical Tuna": {
        "description": "Tuna with practical features.",
        "image_url": "https://cdn.pixabay.com/photo/2021/08/23/17/32/tuna-6568345_1280.jpg",
    },
    "Chair": {
        "description": "A piece of furniture designed for sitting.",
        "image_url": "https://cdn.pixabay.com/photo/2016/11/19/15/50/chair-1840011_1280.jpg",
    },
    "Cheese": {
        "description": "A dairy product made from milk.",
        "image_url": "https://cdn.pixabay.com/photo/2020/05/03/13/23/cheese-5125021_1280.jpg",
    },
    "Fantastic Metal Fish": {
        "description": "A metal fish with fantastic features.",
        "image_url": "https://cdn.pixabay.com/photo/2014/08/12/16/58/art-416776_1280.jpg",
    },
    "Ergonomic Cotton Shirt": {
        "description": "A shirt made with comfortable and ergonomic cotton fabric.",
        "image_url": "https://cdn.pixabay.com/photo/2016/11/23/06/57/isolated-t-shirt-1852115_1280.png",
    },
    "Bike": {
        "description": "A two-wheeled vehicle propelled by pedals.",
        "image_url": "https://cdn.pixabay.com/photo/2015/05/29/19/18/bicycle-789648_1280.jpg",
    },
    "Fresh Bike": {
        "description": "A bike that is newly made or recently reconditioned.",
        "image_url": "https://cdn.pixabay.com/photo/2018/12/03/16/50/air-pollution-3853724_1280.jpg",
    },
    "Chips": {
        "description": "Thin slices of food, usually made from potatoes.",
        "image_url": "https://cdn.pixabay.com/photo/2017/08/14/14/56/crisp-2640743_1280.jpg",
    },
    "Gorgeous Plastic Tuna": {
        "description": "Tuna made with beautiful and high-quality plastic materials.",
        "image_url": "https://cdn.pixabay.com/photo/2015/09/30/10/02/time-965184_1280.jpg",
    },
    "Incredible Cotton Candy": {
        "description": "Candy made from incredible cotton fabric.",
        "image_url": "https://cdn.pixabay.com/photo/2024/01/15/18/03/ai-generated-8510665_1280.jpg",
    },
    "Metal Pizza": {
        "description": "A pizza made with metal ingredients.",
        "image_url": "https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_1280.jpg",
    },
    "Licensed Steel Pizza": {
        "description": "A pizza with a license made from steel.",
        "image_url": "https://cdn.pixabay.com/photo/2021/09/02/13/36/pizza-6593504_1280.jpg",
    },
    "Generic Frozen Pants": {
        "description": "Plants that are frozen and have a generic design.",
        "image_url": "https://cdn.pixabay.com/photo/2020/12/01/13/58/apple-5794354_1280.jpg",
    },
    "New Hat": {
        "description": "A newly made hat.",
        "image_url": "https://cdn.pixabay.com/photo/2018/08/30/10/21/plums-3641830_1280.jpg",
    },
    "Licensed Frozen Car": {
        "description": "A car with a license that is frozen.",
        "image_url": "https://cdn.pixabay.com/photo/2017/07/20/15/56/winter-2522720_1280.jpg",
    },
    "Fantastic Shoes": {
        "description": "Shoes with fantastic features.",
        "image_url": "https://cdn.pixabay.com/photo/2018/08/04/00/18/hiking-shoes-3583017_1280.jpg",
    },
    "Chicken": {
        "description": "A domesticated bird commonly used as food.",
        "image_url": "https://cdn.pixabay.com/photo/2016/11/29/05/32/rooster-1867562_1280.jpg",
    },
    "Wooden Cheese": {
        "description": "Cheese made from wood.",
        "image_url": "https://cdn.pixabay.com/photo/2016/07/28/08/29/pizza-1547254_960_720.jpg",
    },
    "Salad": {
        "description": "A dish consisting of mixed vegetables and dressing.",
        "image_url": "https://cdn.pixabay.com/photo/2022/05/20/08/55/pasta-7209002_1280.jpg",
    },
    "Metal Chips": {
        "description": "Chips made with metal materials.",
        "image_url": "https://cdn.pixabay.com/photo/2016/01/20/11/10/milling-1151344_1280.jpg",
    },
    "Wooden Hat": {
        "description": "A hat made from wood.",
        "image_url": "https://cdn.pixabay.com/photo/2015/06/29/10/45/hat-825456_1280.jpg",
    },
    "Intelligent Wooden Cheese": {
        "description": "Cheese made from intelligent wood.",
        "image_url": "https://cdn.pixabay.com/photo/2010/12/13/10/24/cheese-2785_1280.jpg",
    },
    "Refined Granite Shoes": {
        "description": "Shoes made with refined granite material.",
        "image_url": "https://cdn.pixabay.com/photo/2017/09/19/14/34/shoes-2765458_1280.png",
    },
    "Computer": {
        "description": "An electronic device used for processing and storing data.",
        "image_url": "https://cdn.pixabay.com/photo/2020/10/21/18/07/laptop-5673901_1280.jpg",
    },
    "Fresh Towels": {
        "description": "Towels made from the cleanest and softest fabrics in the world.",
        "image_url": "https://cdn.pixabay.com/photo/2016/08/23/20/30/towels-1615475_1280.jpg",
    },
}

def clear_tables():
    """
    Delete all items from the tables before recreating the seeds.
    """
    print("Deleting old data.")
    
    # Check if cascading works for single instances.
    Request.query.delete()
    Assignment.query.delete()
    Membership.query.delete()
    Item.query.delete()
    Organization.query.delete()
    User.query.delete()
    
    print("Old data deletion complete.")

def seed_users():
    """
    Seeds {USER_SEED_SIZE} users; all users will have the same password for easier code testing.
    """
    users = []
    print_starting_seed("users")
    for i in range(USER_SEED_SIZE):
        user = execute_to_success(create_user, i < USER_SEED_SIZE - 1, ATTEMPT_LIMIT)
        users.append(user)
        # print(user)

    db.session.add_all(users)
    db.session.commit()
    print_ending_seed("users")

def create_user():
    """Creates a new instance of User and returns it.

    Returns:
        User: a new instance of User.
    """
    first_name = fake.first_name()
    last_name = fake.last_name()
    username = (initials := (first_name[0] + last_name).lower()) + (
        number := str(
            fake.random_number(
                digits=(
                    DEFAULT_NUMBER_LENGTH
                    if len(initials) >= DEFAULT_NUMBER_LENGTH
                    else MIN_USERNAME_LENGTH - len(initials)
                )
            )
        ).rjust(DEFAULT_NUMBER_LENGTH, "0")
    )
    email = (first_name + "." + last_name).lower() + number + "@itemizer.com"
    user = User(
        first_name=first_name, 
        last_name=last_name, 
        username=username, 
        email=email,
        is_verified=True
    )
    user.password_hash = PASSWORD
    
    # 5% chance of banning a user.
    if (not random.randint(0, 20)):
        user.is_banned = True
    return user

def seed_orgs():
    """
    Seeds {ORG_SEED_SIZE} organizations.
    """
    # Organization.query.delete()
    orgs = []
    print_starting_seed("organizations")
    for n in range(ORG_SEED_SIZE):
        org = execute_to_success(create_org, n < ORG_SEED_SIZE - 1, ATTEMPT_LIMIT)
        orgs.append(org)

    db.session.add_all(orgs)
    db.session.commit()
    print_ending_seed("organizations")

def create_org():
    """Creates a new instance of Organization and returns it.

    Returns:
        Organization: a new instance of Organization.
    """
    name = fake.company()
    description = fake.sentence()
    org = Organization(name=name, description=description)
    return org

def seed_items():
    """
    Seeds items from the {ITEM_SEED}, which are pre-defined as a dictionary.
    """
    # Item.query.delete()
    items = []
    print_starting_seed("items")
    users = User.query.filter_by(is_banned=False).all()
    for key, value in ITEM_SEED.items():
        item = execute_to_success(create_item, True, ATTEMPT_LIMIT, key, value, users)
        # print(item)
        items.append(item)
    print()
    db.session.add_all(items)
    db.session.commit()
    print_ending_seed("items")

def create_item(key, value, active_users):
    """Creates a new instance of Item and returns it.

    Args:
        key (str): the item name
        value (dict): the dictionary consiting of the dictionary and image url's.

    Returns:
        Item: a new instance of Item.
    """
    part_number = (
        "".join([fake.random_uppercase_letter() for n in range(4)])
        + "-"
        + str(fake.random_number(digits=5))
    )
    # Random boolean reference: https://stackoverflow.com/questions/6824681/get-a-random-boolean-in-python
    item = Item(
        name=key,
        description=value["description"],
        part_number=part_number,
        image_url=value["image_url"],
        is_public=bool(random.getrandbits(1)),
        user_id=random.choice(active_users).id
    )
    return item

def seed_relational_models():
    """Seeds Memberships, Assignments, and Requests, by establishing randomized relations with Users, Items, and Organizations."""
    users = User.query.filter_by(is_banned=False).all()
    items = Item.query.all()
    orgs = Organization.query.all()
    println_starting_seed("memberships")
    println_starting_seed("assignments")
    println_starting_seed("requests")
    for org in orgs:
        # Memberships
        membership_size = random.randint(1, len(users))
        # Assignments
        assignment_size = random.randint(1, len(items))
        # Requests
        non_member_size = len(users) - membership_size
        max_request_size = (
            non_member_size
            if non_member_size < REQUEST_SEED_LIMIT
            else REQUEST_SEED_LIMIT
        )
        request_size = random.randint(0, max_request_size)
        # Randomization
        user_selection = users[:]
        item_selection = items[:]
        print(
            f"Populating Org #{org.id}: (M={membership_size}, A={assignment_size}, R={request_size})",
            end="\t",
            flush=True,
        )
        for n in range(membership_size):
            user = random.choice(user_selection)
            user_selection.remove(user)
            role = RoleType.OWNER if n == 0 else random.choice((RoleType.REGULAR, RoleType.REGULAR, RoleType.REGULAR, RoleType.ADMIN))
            membership = Membership(
                user_id=user.id,
                organization_id=org.id,
                role=role
            )
            db.session.add(membership)
            print_progress(True, "M")

        for n in range(assignment_size):
            item = random.choice(item_selection)
            item_selection.remove(item)
            current_quantity = random.randint(0, MAX_COUNT)
            enough_threshold = random.randint(1, 20)
            assignment = Assignment(
                item_id=item.id,
                organization_id=org.id,
                current_quantity=current_quantity,
                enough_threshold=enough_threshold
            )
            db.session.add(assignment)
            print_progress(n < assignment_size - 1 or request_size > 0, "A")

        for n in range(request_size):
            user = random.choice(user_selection)
            user_selection.remove(user)
            request = Request(
                user_id=user.id, 
                organization_id=org.id,
                reason_to_join=fake.sentence()
            )
            db.session.add(request)
            print_progress(n < request_size - 1, "R")

    db.session.commit()
    print_ending_seed("memberships")
    print_ending_seed("assignments")
    print_ending_seed("requests")

if __name__ == "__main__":
    with app.app_context():
        start_time = time.time()
        print("BEGIN SEED")
        clear_tables()
        seed_users()
        seed_orgs()
        seed_items()
        seed_relational_models()
        print("Seeding complete!")
        end_time = time.time()
        print(f"Seeding duration: {end_time - start_time} seconds.")
