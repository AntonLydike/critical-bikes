<?php

$_CONTROLLERS = [
  "*" => []
];

$_HANDLER = [];

function register_method($method, $path, $function) {
  global $_CONTROLLERS;

  if (!isset($_CONTROLLERS[$method])) $_CONTROLLERS[$method] = [];

  $_CONTROLLERS[$method][path_to_regexp($path)] = $function;

}

function register_status($status, $func) {
  global $_HANDLER;

  if (! is_array($status)) {
    $status = [$status];
  }

  foreach($status as $state) {
    $_HANDLER[$state] = $func;
  }
}

function handle_request() {
  global $_CONTROLLERS;

  $method = $_SERVER['REQUEST_METHOD'];
  $path = $_SERVER['REQUEST_URI'];
  $path = preg_replace("/[?#].*/", "", $path);
  $path = preg_replace("/\/\/+/", "/", $path);

  foreach($_CONTROLLERS[$method] as $regex => $handler) {
    if (preg_match($regex, $path, $matches)) {
      if (ENV_MODE == "DEV") header("X-Route-Used: $method $regex");
      return call_user_func($handler, $matches);
    }
  }
  foreach($_CONTROLLERS["*"] as $regex => $handler) {
    if (preg_match($regex, $path, $matches)) {
      if (ENV_MODE == "DEV") header("X-Route-Used: * $regex");
      return call_user_func($handler, $matches);
    }
  }

  return_status(404, "No action found!", ["path" => $path, "method" => $method]);
}

function return_status($code, ...$args) {
  global $_HANDLER;
  if (!isset($_HANDLER[$code])) {
    die("No handler for status " . $status);
  }

  array_unshift($args, $code);

  call_user_func_array($_HANDLER[$code], $args);
}


function renderJson($status, $obj = null) {
  http_response_code($status);
  header("Content-Type: application/json; charset=utf-8");
  if (is_null($obj)) die();
  die(json_encode($obj));
}

function get_json_body() {
  $inputJSON = file_get_contents('php://input');
  return json_decode($inputJSON, TRUE);
}

function path_to_regexp($path) {
  $parts = explode("/", $path);

  $newParts = [];

  foreach($parts as $part) {
    if ($part == "") continue;

    if ($part[0] == ":") {
      $part = "([^\\/]+)";
    } else if ($part == "*") {
      $part = "[^\\/]+";
    } else if ($part == "**") {
      $part = ".*";
    }

    $newParts[] = $part;
  }

  return "/^\\/" . implode("\\/", $newParts) . "\\/?$/";
}

# list of status codes
define('STATUS_OK',           200);
define('STATUS_CREATED',      201);
define('STATUS_ACCEPTED',     202);
define('STATUS_NO_CONTENT',   204);
define('STATUS_BAD_REQUEST',  400);
define('STATUS_UNAUTHORIZED', 401);
define('STATUS_FORBIDDEN',    403);
define('STATUS_NOT_FOUND',    404);

 ?>
