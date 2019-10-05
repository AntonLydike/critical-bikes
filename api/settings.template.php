<?php
## Here we put all the settings:

define('ENV_MODE', '__MODE__');

# we operate with UTC timestamps, makes things easier down the line
date_default_timezone_set("UTC");

# throw a 500 internal server error, when uuidv4 gets weak randomness from openssl_random_pseudo_bytes
define('ABORT_ON_WEAK_UUID', true);

### MySQL connection:
# wrap inside a function to prevent leaking global vars
function dbConnect () {
	global $mysqli;

	# MySQL auth:
	$MYSQL_HOST      = '__HOST__';
	$MYSQL_USER      = '__USER__';
	$MYSQL_PASSWORD  = '__PASSWORD__';
	$MYSQL_DB        = '__DATABASE__';

	## No other changes required below

	# connect to the DB
	$mysqli = new mysqli(
					 $MYSQL_HOST,
					 $MYSQL_USER,
					 $MYSQL_PASSWORD,
					 $MYSQL_DB
					);

	if ($mysqli->connect_error) {
		die("Error connecting to db!");
	}

	$mysqli->set_charset("utf8");
}

# set error reporting depending on environment
if (ENV_MODE == 'DEV') {
	ini_set('display_errors', 1);
	error_reporting(E_ALL & ~E_NOTICE);
} else {
	ini_set('display_errors', 0);
	error_reporting(0);
}

?>
