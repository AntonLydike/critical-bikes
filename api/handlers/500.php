<?php

register_status(500, function ($code, $message, $errors = []) {
  # only show 500 server error messages in dev mode
  if (ENV_MODE != "DEV") renderJson(500);

  renderJson(500, [
    "message" => $message,
    "errors" => $errors
  ]);
})

?>
