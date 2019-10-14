# CriticalBikes

CriticalMass planning tool. Licensed under the [AGPLv3](https://www.gnu.org/licenses/agpl-3.0.html)

## our motto

 - no registration
 - simple to use
 - open source
 - [simple, REST-like API](/API.md) (so you can even use curl for interaction, if you so desire)

## About this repo

 - The dockerfile is for development purposes only. It's not meant to be deployed anywhere
 - building for development is done with `./bundle.sh` (add `--watch` to enable file watching. uses `inotifywait`)
 - You can use the [`db.sql`](db.sql) file to set up the database and user (probably want to choose a different password)
 - you can configure the "backend" in the [`settings.php`](/api/settings.php)
 - please make sure, that htaccess files are enabled in you apache config, and the rewrite engine is on (`a2enmod rewrite; service apache2 restart`)
 - when you are using this in anothe country, you currently have to modify the geocoding country tag manually in the [`geocode.js`](/src/lib/geocode.js) file.

## Creating and configuring your release

To package this bad boy up, you can use the `release-builder.sh` script. It uses docker to produce repeatable builds. And most importantly this means you don't need nodejs or npm or any of that crap installed on your machine.

you can pass some args to the builder: (format `--sqlusr=criticalmass`)

 - `sqlusr` the sql user you want to use (in php and the sql creation script) (default is `criticalmass`)
 - `sqlpw` the password of the user (default is `password`, PLEASE CHANGE!)
 - `sqldb` the database name (default is `criticalmass`)
 - `sqlhost` the host of the database (default is `localhost`)
 - `mode` the build mode (used by the bundler. just leave it at it's default value of `PROD`)

## Developing

Build the thing with `docker build -t <image tag> .`

Then run the thing with `docker container run --rm -p 8080:80 -p 3306:3306 -it -v <path-to-your-clone>/:/var/www/html <image tag> /start.sh --bash`. You'll be dropped into a bash shell on the container, everything should already work and be accessible under localhost:8080

Once you close the container (with `CTRL+D`) it will automatically be deleted.

## To-Do

 - multilanguage support
 - enable a config for the osm country tag (currently hardocded into [`geocode.js`](/src/lib/geocode.js))
 - delete groups? (should already be implemented in the backend)
 - add documentation for REST API
 - get babel-minify working with the current setup (breaks and says `Error: /build/tmp.build.js: don't know how to turn this value into a node`)
