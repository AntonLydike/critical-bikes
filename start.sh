#!/bin/bash
# this is the docker startup script

echo "starting server..."

# quick and dirty way to enable .htaccess files (DO NOT DO THIS ANYWHERE, PLEASE)
sed -i 's/AllowOverride\sNone/AllowOverride All/gI' /etc/apache2/apache2.conf

service apache2 start
service mysql start

cat /var/www/html/db.sql | mysql -u root

if [ "$1" == "--bash" ]; then
  bash
else
  cat
fi
