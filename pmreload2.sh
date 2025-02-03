#!/bin/bash

export PATH=$PATH:/home/koji/.nvm/versions/node/v16.20.2/bin

~/.nvm/versions/node/v16.20.2/bin/pm2 reload --update-env /home/koji/coesite/apphttps.js  --name server-test-01
date