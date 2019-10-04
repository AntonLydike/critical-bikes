<?php
/**
 *	This file handles the whole db connection and some other helper functions for sql
 *
 *	all methods which are prefixed sql_ return escaped strings
 */


# connect to the DB
dbConnect();

// escapes a string for sql
function sql_esc($string){
	global $mysqli;

	if (!is_string($string)) return $string;

	return $mysqli->real_escape_string($string);
}

// escape the given parameter in place
function sql_esc_r(&$str) {
	global $mysqli;

	$str = $mysqli->real_escape_string($str);
}

// a valid datetime string with the current time
function sql_now() {
	return (new DateTime())->format("Y-m-d H:i:s");
}

// returns the quoted, escaped string or NULL, if the string is not set
function sql_optional($value) {
	if (isset($value) && !is_null($value)) {
		return "'".sql_esc($value)."'";
	}
	return 'NULL';
}

// the same as optional, but it also adds a uuid check and a UUID_TO_BIN call
function sql_opional_valid_uuid($uuid) {
	if (isset($value) && !is_null($value)) {
		return "UUID_TO_BIN('".sql_esc(assert_uuid($value))."')";
	}
	return 'NULL';
}

// returns NULL if a non-value was given, the escaped color, or throws an error
// for invalid colors
function sql_optional_valid_color($color) {
	if (isset($value) && !is_null($value)) {
		return sql_optional(assert_color($value));
	}
	return 'NULL';
}


// makes a SQL request
// if $keyField and $valueField are given, the result will be mapped by them
/* imagein a DB result:
  [{id:1,allow: false}, {id: 2, allow: true}, {id: 'a', allow: false}]

	with keyField = 'id' and valueField = 'allow' the result will become:
	{
		1: false,
		2: true,
		a: false
	}
*/
function sql($sql = false, $keyField = false, $valueField = false){
	global $mysqli;
	$return = [];
	if ($sql == false) return false;

  if (ENV_MODE == "DEV") {
		header("X-sql-query: " . preg_replace('/\s\s+/', ' ', $sql), false);
	}

	$result = $mysqli->query( $sql );

	if ($result === false){
    return_status(500, "Error in mysql request!", $mysqli->error);
		exit();
	} else if ($result === true) {
		return $mysqli;
	}

	while($search = $result->fetch_array(MYSQLI_ASSOC)){
		if (!$keyField) {
			$return[] = $search;
		} else {
			$return[$search[$keyField]] = (!$valueField)?$search:$search[$valueField];
		}

	}

	return $return;
}

# gets the last ID inserted with AUTO_INCREMENT from sql
function sql_last_id() {
	global $mysqli;

	return $mysqli->insert_id;
}

# create part of a query string with some modifiers
function apply_modifiers($modifiers, $logic = "AND") {
  if (count($modifiers) == 0) return "";
  $str = "WHERE " . implode(" AND ", $modifiers);
  if (ENV_MODE == "DEV") header("X-sql-mods: $str");
  return $str;
}

function uuidv4() {
  $data = openssl_random_pseudo_bytes(16, $strong);

	if (ABORT_ON_WEAK_UUID && !$strong) {
		log_error("Weak uuid generated!");
    return_status(500, "Internal server error!");
	}

  $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
  $data[8] = chr(ord($data[8]) & 0x3f | 0x80);

  return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}
