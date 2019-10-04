<?php

register_status([400, 401, 403, 404], function ($code, $message, $errors = []) {
  renderJson($code, [
    "message" => $message,
    "errors" => $errors
  ]);
})

?>
