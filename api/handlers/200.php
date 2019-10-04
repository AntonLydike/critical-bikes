<?php

register_status([200, 201, 202], function ($code, $data, $transform = NULL) {
  if (!is_null($transform)) {
    if (isset($data[0])) {
      $data = apply_transform($data, $transform);
    } else {
      $data = apply_transform([$data], $transform)[0];
    }
  }

  renderJson(200, $data);
});

register_status(204, function($code) {
  http_response_code(204);
  die();
});

function apply_transform($data, $transform) {
  foreach($data as &$line) {
    foreach($transform as $field => $type) {
      if (!isset($line[$field])) continue;
      switch($type) {
        case "boolean":
          $line[$field] = $line[$field] == '1' || $line[$field] == 'true';
          break;
        case "number":
        case "int":
        case "integer":
          $line[$field] = (int) $line[$field];
          break;
        case "float":
        case "double":
          $line[$field] = (float) $line[$field];
          break;
        case "date":
          $line[$field] = strtotime($line[$field]);
      }
    }
  }
  return $data;
}

?>
