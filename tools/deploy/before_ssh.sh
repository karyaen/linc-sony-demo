#!/bin/bash
if [ -f ${RECON64} ]; then
  \rm -rf ${RECON64}
fi
echo -n $travisci_{1..36} >> ${RECON64}
base64 --decode --ignore-garbage ${RECON64} > ${RECON}
chmod 600 ${RECON}
# echo -e "Host github.com\n\tStrictHostKeyChecking no\n" >> ~/.ssh/config
