# Easy Itemizer
Author: Adnan Wazwaz

Version: 1.1

Original Date: 2024 May 7

Current Version Date: 2024 July 8

Adnanian Application #3

## Table of Contents

1. [Overview](#overview)
    1. [What This Application Does](#what-this-application-does)
    2. [Why This Application was Created](#why-this-application-was-created)
    3. [Technologies](#technologies)
    4. [Limitations](#limitations)
2. [Installation & Execution](#installation--execution)
    1. [Installation](#installation)
    2. [Execution](#execution)
3. [Usage](#usage)
4. [Future Plans](#future-plans)
5. [Credits](#credits)

## Overview

### What This Application Does

Easy Itemizer (formerly Itemizer) is a full-stack web application that helps
organizations and individual users keep track of their inventories. The idea is
to only count their items of each type only once, and they can adjust the
quantities of their non-stock items after each usage, to avoid having to count
everything again. The goal is to have members of an organization identify shortages
of items as soon as possible, instead of noticing when such an item has been
depleted at the last minute or when it's too late.

When identifying when an item will be depleted, versus when an item is actually
depleted, managers are able to purchase more of that item ahead of time and will
have them received to the organization residence sooner. In fact, the idea is to
make it appear that item users don't have to wait at all. When there are still
items left, members of organizations don't have to hold off on any projects that
they were working on that required the item.

### Why This Application was Created

In an organization that I was previously a part of, we did not have an efficient
system for keeping track of our inventories. We have tried many ways to do it,
such as using a spreadsheet and writing numbers on each item. Finally, the idea
was proposed to create an application, powered by a database to manage invnetory.
This solution has many of the following benefits that other solutions did not:

- It's much more GUI-friendly.
- This solution is long-term. Even if the creator leaves, the website could still
function.
- No formatting required.
- Informtion is accessed and correctly updated within seconds.
- Has the ability to notify other members about the status of their inventory.
- Data is stored in a more efficient and secure way, versus on a spreadsheet.
Spreadsheets are not meant for data storage, but for accounting or data analysis.

By taking advantage of the benefits that a web application would offer, I was
able to create a minimum viable product that any company, organization, or
even family home can use to keep track of their items in a easy, convenient,
manner.

The purpose of organizations and assignments is to ensure that one organization's
item count is local to that organization and likewise for another organization.
This is to prevent two organizations from showing the same item count in their
inventories when in reality they have different quantities. For example, I live
in my house and you live in yours. We would definitely have different numbers of
toilet paper rolls that we have left. The counts would always need to be local 
instead of global.

This was also part of my [Flatrion School Phase 4 project](https://github.com/adnanian/itemizer),
where I've been tasked to create a full stack web application using everything
that I learned in this phase and the other phases.

It's now part of my Flatiron School Phase 5 project, where I built off of the code
I wrote from Phase 4, and decided to not only improve it, but deploy it so that
it can be used **live**. This iteration even includes a purchased domain name:
**easyitemizer**.

### Technologies

#### Frontend

With this being a full stack web application, several technologies have been used
to power it. On the frontend, the languages used were HTML, CSS, and JavaScript,
with JavaScript being simplified with the framework [ReactJS](https://react.dev/).
In this application, you could navigate to ten different pages. This was made
possible with [React Router DOM v6](https://reactrouter.com/en/main). Essentially,
the same frontend technologies used in Phase 4. One thing to also note is that in
Phase 5, I was required to implement either [useContext](https://react.dev/reference/react/useContext)
or [Redux](https://redux.js.org/). I opted to implement useContext. And I would
like to give a shoutout to my colleague, Anna Cole for writing [an excellent
guide on this complicated React hook](https://medium.com/@anna-cole/a-beginners-guide-on-how-to-implement-context-in-a-react-application-for-better-state-management-06e52897715d).

One last frontend technology used to power the development of this application is
[Vite](https://vitejs.dev/guide/). Vite is, according to the website, is a build
tool for faster and leaner development for modern web projects. I would like to
give my instructors, Enoch Griffith and Stephen Lambert, for providing me with
the Vite template to develop my app on.

Side note: the CSS has considerably improved.

#### Backend

On the backend, there are some major additions and changes in the technologies used.
Like Phase 4, I still use Python and [Flask](https://flask.palletsprojects.com/en/3.0.x/). 
I still use Flask RESTful to create RESTful API's. However, the API's aren't as
simplified as they were in Phase 4. This is because in Phase 4, I had to make
multiple fetch requests to complete certain tasks, such as creating organizations
and transferring ownerships. I resolved to reduce the number of fetch requests
made to the server within a function, which meant that I needed to create more
resources. While there are still some remnants of DRY Resource inheritance, it's
no longer as extensive or frequent.

For the database, I switched from SQLite to Postgres SQL. Postgres SQL is much
more resourceful when you want to create table columns of data-types such as
Arrays and Enums. The database was created on Render. I was able to simplify the
use of SQL by creating SQL commands using Flask SQL Alchemy, instead of having to
write all my queries manually. I was also able to use Flask Restful to create a
DRY RESTFul API for all my resources. The Postgres SQL database consists of seven
tables:

![Itemizer Table Relations](/README_images/Easy%20Itemizer%20Schema.png)

In Phase 5, I was required to implement a technology not taught in the curriculum.
I decided to go with [Flask Mail](https://pypi.org/project/Flask-Mail/). Although,
we were taught Flask, we were not taught Flask Mail. Flask Mail is an extension
of Flask, allowing you to send emails from your application. I was able to get
Flask Mail to work by using an email delivery platform called [Mailtrap](https://mailtrap.io/).

#### Other

As mentioned earlier, I purchased my own domain name from [GoDaddy](https://www.godaddy.com/).
I also deployed my web application to [Render](https://dashboard.render.com/) as
a web service. Using the guides that GoDaddy and Render provided, I successfully
configured my DNS settings for Render, so that when I type the URL for the live
webiste, it will automatically go through Render, instead of loading a completely
different and unrecognizable page.

I created the email templates, and static pages that users open outside the applicaiton,
with HTML. However, they all exist in the server folder instead of the client folder.
Flask woudln't be able to open any of the templates if they resided in the client
folder.

One last technology I used was Bash. I created a Bash script for the purposes of
route configuration. But more on that later.

#### Size Scaling

As a side note, it was difficult to style the application for smaller desktop
screens, even though I manage to have done it. I had to create a custom hook
that involves calculating the appropriate sizing and positioning of certain
elements, which takes into account the current screen size that the application
is being viewed on and the screen size, in which I developed it: a 1920 x 1080
monitor. In Google Chrome, the screen height of the content inside the window
would be 911 pixels.

Here's how I came up with the calculation to scale by ratios (i.e. for properties)
that couldn't be calculated by width or height alone, mainly font size.

Let's assign the following mathematical variables:
- W = the original screen width (in which I developed the application on)
- H = the original screen height
- A = WH, the area of the original screen in squared pixels.
- w = the current screen width
- h = the current screen height
- a = wh, the area of the current screen in squared pixels.
- F = the original font size.
- X = the width of the original font (if we treated font as an area).
- Y = the height of the original font.
- F = XY
- f = the font size to set to for the current screen size.
- x = the width of the new font size.
- y = the height of the new font size.
- f = xy

With these assignments and assumptions in mind, we can perform a little algebra
to calculate the new font size:

1. $$F = XY, A = WH $$
    1. We know what F, A, W, and H are. We need to get X and Y.
    2. This can be done by equating the two products as ratios:
2. $$\frac{X}{Y} = \frac{W}{H}$$
3. $$HX = WY $$
    1. We can use the font equation, F = XY, to create a substitute for Y.
    2. $$Y = \frac{F}{X}$$
    3. Now, Y is in terms of X.
4. $$HX = \frac{WF}{X}$$
5. $$HX^2 = WF$$
    1. Solve for X.
6. $$X^2 = \frac{WF}{H}$$
7. $$X = \sqrt{\frac{WF}{H}}$$
    1. If we were to substitute X in terms of Y and solved for Y, we would have gotten the following:
    2. $$Y = \sqrt{\frac{HF}{W}}$$
8. To get x and y, use the formulas to scale by width and height, respectively.
    1. x:
        1. $$\frac{x}{X} = \frac{w}{W}$$
        2. $$Wx = wX$$
        3. $$x = \frac{wX}{W}$$
    2. y:
        1. $$\frac{y}{Y} = \frac{h}{H}$$
        2. $$Hy = hY$$
        3. $$y = \frac{hY}{H}$$
9. Since we know that $$f = xy$$, we can now substitute x and y.
    1. $$f = \frac{wX}{W} * \frac{hY}{H}  = \frac{whXY}{WH}$$
10. We can also substitute X and Y. This will allow the euqation
to be simplified in terms of screen size and original font size,
eliminating both uppercase and lowercase x and y values.
    1. $$f = \frac{wh\sqrt{\frac{WF}{H}}\sqrt{\frac{HF}{W}}}{WH}$$
    2. $$f = \frac{wh\frac{WHF}{HW}}{WH}$$
    3. Final result: **$$f = \frac{whF}{WH}$$**

This is the formula that is used for the scaleByRation function
in the useScreenSize helper hook.


### Limitations

In Phase 4, this application had the following limitations, which have all been
corrected and mitigated in Phase 5:

- User accounts were not real, and were generated using Python's faker library.

- You could only run this application in development mode.

- There was no notification system for updating users.

- Sending status updates and reports of suspicious items actually did nothing.

- You couldn't reset your password, as there was no page for it.

These issues were all solved with Flask Mail, GoDaddy, and Render. But with that
being said, there are now a new series of limitations:

- Due to how Render configures route settings, typing in a backend route in
the browser's URL serach bar, could potentially return serialized database
records in JSON format, which is a major security vulnerability.

-  But this website is currently not suited to
be run on mobile devices.

- The tokens generated for links are not secure. The ports are easily exposed.
There is also almost no code to prevent the same page with the same token from
being accessed twice.

- Reliance on HTML, internal CSS, and internal Vanilla JS file to create static
pages isn't really the solution that conforms to best coding practices.

- Fetch requests are fairly slow, and even slower in production.

- You can't upload files from your desktop. You can only copy and paste image
URL's from the browser.

- When you make a change to a database record, users on other devices won't receive
those changes on the frontend until they refresh the current page. For example,
if a system admin decided to ban a user, he/she won't be redirected to the login
page until the page is refreshed.

All these limitations will hopefully be corrected in the next iteration of
this project.

## Installation & Execution

### Installation

The good news is that installing this application is quite easy. But before proceeding
to install, ensure that you have Node v18.16.1 and Python v3.9.17 installed on your local
machine (if that's where you intend to install to). This project is saved in my
[Flatiron School Phase 5 Project on Github](https://github.com/adnanian/easy-itemizer-web).
Once you open the repository, you then fork and clone your own instance on your machine.
The live website can be found here: (https://www.easyitemizer.com/).


### Execution

#### Setup

Open the project on VS Code. Once VS Code is loaded, you'll need to run a few
installations before launching the application:

1. Ensure your current directory is the root of the project.

2. Run `pipenv install && pipenv shell` to install all Python and Flask dependencies,
as well as the Python virtual environment.

3. Exit the Python Virtual Environment using `CTRL + D` (Windows) or `Cmd + D` (Mac).

4. Navigate to the root directory of your project and run `npm install --prefix client`.

5. *(Optinal)* If you want to view the Postgres SQL database, you can install the
VSCode extension: [PostgresSQL by Chris Kolkman](https://marketplace.visualstudio.com/items?itemName=ckolkman.vscode-postgres).
The link also provides a guide on setting up the database on your forked and cloned
instance. Note: You will need to contact the original developer: Adnan Wazwaz
for sensitive information.

#### Running in Development Mode

Before running the application on a development server, you will need to configure
the routes for a development server. The route settings for development are different
than those for production.

Luckily, I have a nice and handy Bash script to make it easy for you. Go to the root
of the project directory and type the following command: `./configure-routes.sh`.
This script runs a Common JS file that will make changes to some of the JS files
by replacing certain values. You can learn more by looking at the file itself:
*configureRouteSettings.cjs*.

When you run the Bash script, it will first navigate you to the root directory
of the project. Then execute *configureRouteSettings.cjs*. You will be prompted
to select a configuration type. Select *Development* and press **ENTER**. After
that, the routes will be configured for a development server, and will automatically
launch using Honcho. You can click on the localhost link that is printed to the
terminal to open up the page.

If you're using Honcho to run your application, then any changes you make to the
server will not sync with the currently running application until you stop the
Honcho-powered service and restart it using `honcho start -f Procfile.dev`.
If you find this inconvenient, then you can instead run your application the
following way:

1. Launch your Python Virtual Environment: `pipenv shell`.
2. Navigate to the server directory: `cd server`.
3. Launch the Flask application: `python app.py`.
4. Open a second terminal and make sure you're in the root folder.
5. Run the React application: `npm run dev --prefix client`.

**PLEASE BE EXTREMELY CAREFUL ABOUT ALTERING ANY ROUTE CONFIGURATION SCRIPT
OR SETTING!**

#### Running in Production Mode

The first thing you need to make sure is to add any Python extension, library,
or dependency that you installed to the Pipfile. After that, configuring for
production is easy.

To test your changes to the application in production mode, use the same Bash
script and select *Production* instead. Then, you will be prompted to enter
a message to commit and push your changes to GitHub. Once you've done that, the
script will rerun `pipenv install` to ensure that all needed python resources
are included in the Pipfile.lock and requirements.txt. The next thing it would
do is run commands to push your changes to production. Then, will finally commit
your changes and push to both the development and main branches.

## Usage

### Creating an Account

You will need to create an account by going to the login page, then clicking on
the link that says **Don't have an account? Click here to signup**.

Next fill out all the information in the signup form. Once you've done that,
click on the checkbox that you've agreed to the terms and conditions. (There
currently are none.) And click on the submit button.

If you filled out all information correctly, you will be redirected to the login
page.

### Logging In

Login with your new account, or any account in the database. For the purposes of
development, all users are generated by python seed. Users have a fake username
in the format of first initial, last name, and a number consisting
of 4 digits. (Some users may have more digits to ensure that all usernames are
at least 8 characters in length.) The emails are in the format of
firstname.lastnameNUMBER_FROM_USERNAME@itemizer.com. **(@itemizer.com is not a
real domain name at this time.)**

Example:
- Name: John Smith
- Username: jsmith1234
- Email: john.smith1234@itemizer.com

Log in using the username/email and password. Upon successful login, you will be
redirected to the home page with a new set of navigational links.

### Home Page

![What the logged in user sees](/client/public/images/README/Home%20Page.png)

In the home page, you can see all items that are in the system. The new navigational
bar consists of the following links:
- About - the about section.
- Organizations - a page of all organizations in the system and the user's memberships.
- Settings - a page to manage the user's profile.
- Logout - logs the user out of his/her account.

### Organizations Page

Clicking the **Organizations** link will take you to the organizations page. It
consists of two radio buttons that you select to display one of the following
views:
- All Organizations - displays a table of all organizations that exist in the system.
- My Organizations - displays a tile for each organization that the logged in user
belongs to.

There is also a button, *Create an organization*, that allows you to create a
new organization under your ownership.

#### All Organizations

![Table of all organizations in the system](/client/public/images/README/Organizations%20Table.png)

The table will display the organization's basic information along side
one of three different elements in the last column:

- All organizations that the user is a member of will be highlighted in green
with the appropriate message.
- All organizations that the user has requested to join will be highlighted in
yellow with the appropriate message.
- All other organizations will show an orange button that a user can click to request
to join. The button displays a form that the user has to fill out to submit. Once
the request has been submitted, then the status will change to the yellow message.

#### My Organizations

![Tiles of all organizations that the user is a member of](/client/public/images/README/User's%20Memberships.png)

This page displays all organizations that you are part of. It includes needed
information as well as your current role.

There are three membership roles:
- REGULAR
    - basic access to the organization; can view other members, add new items, and
adjust quantities.
- ADMIN
    - can manage membership access, process requests, remove items, and has
    other priveleges that a REGULAR does.
- OWNER
    - can modify or delete the organization itself, and has other privelges
    that REGULAR and ADMINS do. **THERE CAN ONLY BE ONE OWNER PER ORGANIZATION!**

Clicking on a link will take you to that organization.

## Accessing an Organization's Data

![What a member of an organization will see.](/client/public/images/README/Organization%20View.png)

In this page, you will see a line of buttons, which will be different
depending on your role. These buttons perform different tasks, that were
discussed in the previous section.

You will also see a pink card for each
item that the organization is using. It includes a picture, its quantity,
and two buttons to adjust the quantities as needed.

To adjust a quantity, click the minus or plus button. A modal form
will display and prompt you to enter a number to subtract or add.
The new quantity would summarily be updated to the system.

## Miscellaneous Features

All other features that were discussed but not demonstrated here are more-or-less
self explanatory and is recommended for you to check out for yourself.


## Future Plans

I plan to improve the application by fixing the limitations as 
noted in the Limitations section. In addition to that, I also plan
to do the following:

- Invite users to join your organization.
- Search bars for items, assignments, and organizations.
- Make items private or public so that users don't have to
publish sensitive information.
- Allow users to edit the names of their items or remove them from
the system altogether.
- Create a subscription plan for organizations and users to use, to keep
this application running.

## Credits
MIT License

Copyright (c) 2024 Adnan Wazwaz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Once again, shoutout to [Enoch Griffith](https://www.linkedin.com/in/enochgriffith/)
for letting me use his Flatiron Flask Project Generator.