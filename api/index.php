<?php

require_once 'settings.php';
require_once 'sql.php';
require_once 'auth.php';
require_once 'assert.php';
require_once 'requestLogic.php';


foreach (glob("sql/*.php") as $filename) {
    require_once $filename;
}
foreach (glob("handlers/*.php") as $filename) {
    require_once $filename;
}
foreach (glob("methods/*.php") as $filename) {
    require_once $filename;
}

handle_request();
