cd /home/dpkodev.un.org/tubukawa/hosting/coesite; /usr/local/bin/pm2 stop coesite; /usr/local/bin/pm2 delete coesite;/usr/local/bin/pm2 start app.js -i 1 --name coesite
