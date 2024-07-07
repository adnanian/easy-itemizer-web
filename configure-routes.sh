#!/bin/bash

# This script is designed solely for the Flatiron School Phase 5 Project, Easy Itemizer,
# created by Adnan Wazwaz.
# Purpose is to configure 

# CURRENTLY IN DEVELOPMENT

#node client/configureClient.cjs
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