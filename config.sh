#!/bin/bash
# this configures the backend settings file and db dump

# this script requires babel (npm!)

set -eu

sqldump=db.sql
sqldump_tpl=db.template.sql

phpcfg=api/settings.php
phpcfg_tpl=api/settings.template.php

# grab data from args, escape for use with sed
sqlusr=$(echo $1 | sed -e 's/\([[\/.*]\|\]\)/\\&/g')
sqlpw=$(echo $2 | sed -e 's/\([[\/.*]\|\]\)/\\&/g')
sqldb=$(echo $3 | sed -e 's/\([[\/.*]\|\]\)/\\&/g')
sqlhost=$(echo $4 | sed -e 's/\([[\/.*]\|\]\)/\\&/g')

# replace template strings in template db setup script
rm $sqldump;
mv $sqldump_tpl $sqldump
sed -i "s/__USER__/$sqlusr/g;s/__PASSWORD__/$sqlpw/g;s/__DATABASE__/$sqldb/g" $sqldump

# replace template strings in template settings.php script
rm $phpcfg;
mv $phpcfg_tpl $phpcfg
sed -i "s/__USER__/$sqlusr/g;s/__PASSWORD__/$sqlpw/g;s/__DATABASE__/$sqldb/g;s/__HOST__/$sqlhost/g;s/__MODE__/PROD/g" $phpcfg

# run bundler
./bundle.sh --production

# assemble polyfill and main script
cat node_modules/@babel/polyfill/dist/polyfill.js > tmp.build.js
cat main.build.js >> tmp.build.js

# run thing through babel
babel tmp.build.js --out-file main.build.js

# package it up
tar -czvf /criticalbike.tar.gz public api index.html main.* db.sql README.md
