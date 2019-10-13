<?php

register_method('POST', '/api/groups/:group/part', function ($matches) {
  $user = sql_esc(assert_auth());
  $groupId = sql_esc($matches[1]);
  $body = get_json_body();

  assert_json_has($body, 'name');

  $name = sql_esc($body['name']);

  sql("INSERT INTO participations (`group`, `uid`, `name`) VALUES ('$groupId', '$user', '$name')");

  return_status(STATUS_CREATED, getGroup($groupId, $user), ['isCreator' => 'boolean']);
});

register_method('DELETE', '/api/groups/:group/part', function ($matches) {
  $user = sql_esc(assert_auth());
  $groupId = sql_esc($matches[1]);

  $resp = sql("DELETE FROM participations WHERE `group` = '$groupId' AND uid = '$user' LIMIT 1");

  if ($reps->affected_rows == 1) {
    return_status(STATUS_OK, getGroup($groupId, $user), ['isCreator' => 'boolean']);
  } else {
    return_status(STATUS_NOT_FOUND, "Group not found", ['id' => $groupId, 'user' => $user]);
  }

});

?>
