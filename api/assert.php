<?php

function assert_auth() {
  $user = get_uid();
  if ($user == null) return_status(STATUS_UNAUTHORIZED, "Please submit your user id and name!");
  return $user;
}

function assert_number($number, $float = false) {
  if ($float) {
    if(preg_match("/^[0-9]*$/", $number)) {
      return (int) $number;
    }
  } else {
    if(preg_match("/^[0-9]*\\.?[0-9]*$/", $number)) {
      return (float) $number;
    }
  }
  return_status(STATUS_BAD_REQUEST, "Assertion error!", ["$number is not a valid " . ($float ? "float" : "integer")]);
}

function assert_hex($hex, $length = -1) {
  if(preg_match("/^[0-9A-f]*$/", $hex) && ($length == -1 || strlen($hex) == $length)) {
    return strtolower($hex);
  }
  return_status(STATUS_BAD_REQUEST, "Assertion error!", ["$hex is not hexadecimal" . ($length != -1 ? " of length $length" : "")]);
}

function assert_uuid($str) {
  if (!preg_match('/^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/', $str)) {
    return_status(STATUS_BAD_REQUEST, "Given value is not a valid UUID!", ['id' => $str]);
  }

  return $str;
}

function assert_result($result, $message, $errors = []) {
  if (is_null($result) || count($result) == 0) return_status(404, $message, $errors);
}
function assert_min_rows($result, $min, $code, $message, $errors) {
  if (count($result) > $min) return_status($code, $message, $errors);
}

function assert_json_has($json, $fields) {
  if (!is_array($fields)) $fields = [$fields];

  foreach($fields as $field) {
    if (!isset($json[$field]) || is_null($json[$field])) {
      return_status(STATUS_BAD_REQUEST, "Field $field is required!");
    }
  }
}

 ?>
