#!/usr/bin/env python3
from config import app, db, send_email
from models.models import *
from flask import render_template_string, redirect, session

def check_if_terminate(input):
    if input == "0":
        exit(0)

if __name__ == "__main__":
    with app.app_context():
        while True:
            print("Enter the username or email of the user you would like to ban/unban. To cancel this operation. Enter \"0\".")
            user_info = input("\n> ")
            print()
            # Terminate program if need be
            if user_info == "0":
                exit(0)
            user = User.query.filter(
                (User.username == user_info) |
                (User.email == user_info)
            ).first()
            if user:
                if user.is_banned:
                    print(f"User, \"{user.username}\" is already banned. Would you like to UNBAN this user?")
                    print("Y/Yes/N/No")
                    choice = input("\n>")
                    choice = choice.upper()
                    print()
                    if (choice == "Y" or choice == "YES"):
                        user.is_banned = False
                        file_word = "unban"
                        subject_action = "Account Reinstatement"
                        print ("Enter the reason for unbanning this user. To cancel this operation. Enter \"0\".")
                    elif (choice == "N" or choice == "NO"):
                        continue
                    else:
                        print("Invalid choice.")
                        continue
                else:
                    user.is_banned = True
                    file_word = "ban"
                    subject_action = "Suspension"
                    print("Enter the reason for banning this user. To cancel this operation. Enter \"0\".")
                reason = input("\n> ")
                print()
                if reason == "0":
                    continue
                # Ban/Unban user
                db.session.add(user)
                db.session.commit()
                # Notify user that he/she has been banned
                with open(f"./html-templates/emails/{file_word}_notice.html", "r") as file:
                    template_content = file.read()
                html = render_template_string(
                    template_content,
                    first_name = user.first_name,
                    reason = reason
                )
                subject = f"Notice of {subject_action}"
                send_email(subject, [user.email], html)
                print(f"User, \"{user.username}\", has been {file_word}ned from Easy Itemizer.\n")
            else:
                print(f"User with username/email, \"{user_info}\" not found. Please try again.\n")
            