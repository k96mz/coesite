sudo /usr/local/bin/pm2 stop coesite; sudo /usr/local/bin/pm2 delete coesite; sudo /usr/local/bin/pm2 start app.js  --name coesite; /usr/local/bin/pm2 monit

