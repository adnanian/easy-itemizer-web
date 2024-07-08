#!/bin/bash

# This script is designed solely for the Flatiron School Phase 5 Project, Easy Itemizer,
# created by Adnan Wazwaz.
# Purpose is to configure 

# EXECUTES THE COMMON JS FILE configureRouteSettings.cjs.

# USER WILL CHOOSE TO CONFIGURE ROUTES FOR DEVELOPMENT OR PRODUCTION.

# IF CHOSEN TO CONFIGURE FOR DEVELOPMENT, THEN THE ROUTES WILL BE CONFIGURED
# FOR DEVELOPMENT AND THE APPLICATION WILL LAUNCH USING HONCHO.

# IF CHOSEN TO CONFIGURE FOR PRODUCTION, THEN THE ROUTES WILL BE CONFIGURED
# FOR PRODUCTION. THEN, THE DEVELOPER IS PROMPTED TO ENTER A MESSAGE FOR
# COMMTTING TO THE REPOSITORY. AFTERWARDS, A SERIES OF STEPS WILL BE TAKEN
# TO ENSURE ALL DEPENDENCIES ARE INSTALLED AND EXPORTED TO PRODUCTION, BEFORE
# FINALLY COMMITTING AND PUSHING THE CHANGES TO THE MAIN BRANCH OF THE GIT
# REPOSITORY. FROM THERE, THE WEB APPLICATION WILL BE REDEPLOYED.


cd ~/Development/code/projects/phase-5-project/easy-itemizer-web
pwd
node client/configureRouteSettings.cjs
CONFIGTYPE=$(<configType.txt)
echo $CONFIGTYPE
if [ $CONFIGTYPE = "Production" ];
then
    read -p "Enter the commit message: " MESSAGE
    pipenv install
    pipenv requirements > requirements.txt
    npm run build --prefix client
    git add .
    git commit -m "$MESSAGE"
    git push origin HEAD
    git push origin HEAD:main
else
    honcho start -f Procfile.dev
fi