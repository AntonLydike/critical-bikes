#!/bin/bash
# this configures the backend settings file and db dump

# this script requires babel (npm!)

set -eu

sqldump=db.sql
sqldump_tpl=db.template.sql

phpcfg=api/settings.php
phpcfg_tpl=api/settings.template.php

sqlusr=$1
sqlpw=$2
sqldb=$3
sqlhost=$4

rm $sqldump;
mv $sqldump_tpl $sqldump
sed -i "s/__USER__/$sqlusr/g;s/__PASSWORD__/$sqlpw/g;s/__DATABASE__/$sqldb/g" $sqldump


rm $phpcfg;
mv $phpcfg_tpl $phpcfg
sed -i "s/__USER__/$sqlusr/g;s/__PASSWORD__/$sqlpw/g;s/__DATABASE__/$sqldb/g;s/__HOST__/$sqlhost/g;s/__MODE__/PROD/g" $phpcfg

# run thing through babel
babel main.build.js -d out

tar -czvf /criticalbike.tar.gz out public api index.html main.* db.sql README.md
