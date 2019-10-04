# CriticalBikes

CriticalMass planning tool.

## our motto

 - no registration
 - simple to use
 - open source

## About this repo

 - The dockerfile is for development purposes only. It's not meant to be deployed anywhere
 - the js is built with a custom shell script wich does "dependency handling". It does not yet transpile js (because I haven't found a way to do this without installing nodejs)
 - building the js is done with `./build.sh` (add `--watch` to enable file watching. uses `inotifywait`)
 - You can use the [`db.sql`](db.sql) file to set up the database and user (probably want to choose a different password)
 - you can configure the "backend" in the [`settings.php`](/api/settings.php)
 - please make sure, that htaccess files are enabled in you apache config, and the rewrite engine is on (`a2enmod rewrite; service apache2 restart`)
 - when you are using this in anothe country, you currently have to modify the geocoding country tag manually in the [`geocode.js`](/src/lib/geocode.js) file.
