<?php
register_method("GET", "/api/groups/", function ($matches) {
  $uid = get_uid();

  if (is_null($uid)) {
    $uid = "0";
  }

  $from = $_GET['from'];
  $limit_query = '';
  if (isset($from)) {
    $from = sql_esc($from);
    $limit_query = " WHERE `time` > '$from' ";
  }

  $limit = $_GET['limit'];
  $limit = isset($limit) ? sql_esc($limit) : 100;
  $offset = $_GET['offset'];
  $offset = isset($offset) ? sql_esc($offset) : 0;

  $groups = sql("SELECT `id`, `description`, `address`, `destination`, `lat`, `lon`, `time`, IF(`creator` = '$uid', 1, 0) as isCreator FROM `groups` $limit_query ORDER BY `time` DESC LIMIT $offset, $limit");

  $groupDict = [];

  foreach ($groups as &$group) {
    $groupDict[$group['id']] = &$group;
    $group['participants'] = [];
  }

  $groupIds = "'".implode("', '", array_keys($groupDict))."'";

  $participants = apply_transform(sql("SELECT `group`, `name`, IF(`uid` = '$uid', 1, 0) as isMe
    FROM `participations` as p
    JOIN `groups` as g ON p.`group` = g.`id`
    WHERE g.id IN ($groupIds)"
  ), ['isMe' => 'boolean']);

  foreach ($participants as $participant) {
    if (!isset($groupDict[$participant['group']])) {
      // log error? (we got a participation back, for a group we do not have)
      continue;
    }

    $groupDict[$participant['group']]['participants'][] = $participant;
  }

  return_status(STATUS_OK, array_values($groups), ['isCreator' => 'boolean']);
});

register_method("POST", "/api/groups/", function ($matches) {
  $user = sql_esc(assert_auth());
  $body = get_json_body();

  assert_json_has($body, ['address', 'time', 'lat', 'lon', 'creator']);

  $query = new InsertQuery('groups');

  $query->with_uuid()
    ->set('address', substr($body['address'], 0, 128))
    ->set('time', $body['time'])
    ->set('lat', $body['lat'])
    ->set('lon', $body['lon'])
    ->set('creator', $user)
    ->set_optional('destination', substr($body['destination'], 0, 128))
    ->set_optional('description', substr($body['description'], 0, 1024))
    ->run();

  $id = $query->getId();
  sql("INSERT INTO participations(`group`, `uid`, `name`) VALUES ('$id', '$user', '$body[creator]')");

  if ($query->success) {
    return_status(STATUS_CREATED, getGroup($query->getId(), $user), ['isCreator' => 'boolean', 'time' => 'number']);
  } else {
    return_status(STATUS_BAD_REQUEST, "Could not create group");
  }
});

register_method("DELETE", "/api/groups/:group", function ($matches) {
  $user = sql_esc(assert_auth());
  $group = sql_esc(assert_uuid($matches[1]));

  $res = sql("DELETE FROM groups WHERE id = '$group' AND creator = '$user' LIMIT 1");

  if ($res->affected_rows >= 1) {
    return_status(STATUS_NO_CONTENT);
  } else {
    return_status(STATUS_NOT_FOUND, "Group not found (or does not belong to you)");
  }
});

register_method("POST", "/api/groups/:group", function ($matches) {
  $user = sql_esc(assert_auth());
  $body = get_json_body();
  $groupId = sql_esc(assert_uuid($matches[1]));

  $group = sql("SELECT `id` FROM groups WHERE id = '$groupId' AND creator = '$user'");

  assert_result($group, "Group not found (or does not belong to you)!");

  $query = new UpdateQuery('groups', $groupId);
  $query
    ->set_optional('destination', $body['destination'])
    ->set_optional('lat', $body['lat'])
    ->set_optional('lon', $body['lon'])
    ->set_optional('description', $body['description'])
    ->set_optional('address', $body['address'])
    ->set_optional('time', $body['time'])
    ->where("creator = '$user'")
    ->run();

  if ($query->success) {
    return_status(STATUS_OK, getGroup($groupId, $user), ['isCreator' => 'boolean', 'time' => 'number']);
  } else {
    return_status(500, "Error editing group");
  }
});

function getGroup($id, $uid = '') {
  $group = sql("SELECT `id`, `description`, `address`, `destination`, `lat`, `lon`, `time`, IF(`creator` = '$uid', 1, 0) as isCreator FROM `groups` WHERE id = '$id'");
  if (is_null($group) || count($group) == 0) return null;

  $group = $group[0];

  $group['participants'] = apply_transform(sql("SELECT `group`, `name`, IF(`uid` = '$uid', 1, 0) as isMe
    FROM `participations` as p
    JOIN `groups` as g ON p.`group` = g.`id`
    WHERE g.id = '$id'"
  ), ['isMe' => 'boolean']);

  return $group;
}
?>
