#!/bin/bash

# This script is designed solely for the Flatiron School Phase 5 Project, Easy Itemizer,
# created by Adnan Wazwaz.
# Purpose is to configure 

# CURRENTLY IN DEVELOPMENT

#node client/configureClient.cjs
cd ~/Development/code/projects/phase-5-project/easy-itemizer-web
pwd
pipenv requirements > requirements.txt
npm run build --prefix client
gid add .
git commit -m [message]
git push origin HEAD
git push origin HEAD:main