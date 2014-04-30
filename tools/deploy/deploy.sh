#!/bin/bash 

# A simple deploy script that Travis runs after ssh'ing into the AWS-EC2
# instance. This script should be run as sudo.
MY_DIR=`dirname $0`
sudo service linc-sony-demo stop
sudo killall node # for some reason stopping is not enough :-(
cd ${MY_DIR}/../..
sudo git pull origin master # for now
# sudo npm install # need to take care of new modules/dependencies -- TODO
# sudo gulp version changelog # Revisit TODO
sudo chown -R rnr:rnr ${MY_DIR}/../..
sudo service linc-sony-demo start
echo "Done at `date`" >> ${MY_DIR}/ci.log
BUILD_ID=`git log -n 1 --oneline`
MAIL_TO="magicaj@gmail.com, kedar.mhaswade@gmail.com"
cat - << EOF | sudo sendmail -t
to:${MAIL_TO}
from:ci_bot@lcloud.com
subject:Build Deployed: ${BUILD_ID}

The ${BUILD_ID} has now been deployed.
See: http://${CLOUD_DEV_IP}:3000

- RnR CD

EOF
