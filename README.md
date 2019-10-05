# CriticalBikes

CriticalMass planning tool.

## our motto

 - no registration
 - simple to use
 - open source

## About this repo

 - The dockerfile is for development purposes only. It's not meant to be deployed anywhere
 - the js is built with a custom shell script wich does "dependency handling". It does not yet transpile js (because I haven't found a way to do this without installing nodejs)
 - building for development is done with `./bundle.sh` (add `--watch` to enable file watching. uses `inotifywait`)
 - You can use the [`db.sql`](db.sql) file to set up the database and user (probably want to choose a different password)
 - you can configure the "backend" in the [`settings.php`](/api/settings.php)
 - please make sure, that htaccess files are enabled in you apache config, and the rewrite engine is on (`a2enmod rewrite; service apache2 restart`)
 - when you are using this in anothe country, you currently have to modify the geocoding country tag manually in the [`geocode.js`](/src/lib/geocode.js) file.

## Creating and configuring your release

To package this bad boy up, you can use the `release-builder.sh` script. It uses docker to produce repeatable builds. And most importantly this means you don't need nodejs or npm or any of that crap installed on your machine.

you can pass some args to the builder:

 - `sqlusr` the sql user you want to use (in php and the sql creation script) (default is `criticalmass`)
 - `sqlpw` the password of the user (default is `password`, PLEASE CHANGE!) 
 - `sqldb` the database name (default is `criticalmass`)
 - `sqlhost` the host of the database (default is `localhost`)
 - `mode` the build mode (used by the bundler. just leave it at it's default value of `PROD`)
