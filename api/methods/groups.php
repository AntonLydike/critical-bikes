<?php
register_method("GET", "/api/groups/", function ($matches) {
  $uid = $_GET['uid'];
  // $uid = assert_auth();

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


  $groups = sql("SELECT `id`, `address`, `time`, IF(`creator` = '$uid', 1, 0) as isCreator FROM `groups` $limit_query ORDER BY `time` DESC LIMIT $limit, $offset", 'id');

  $participants = sql("SELECT `group`, `name`, IF(`uid` = '$uid') as isMe
    FROM participations as p
    JOIN groups as g ON p.group = g.id
    WHERE g.id IN (SELECT `id` FROM `groups` $limit_query ORDER BY `time` DESC LIMIT $limit, $offset)");

  foreach ($participants as $participant) {
    if (!isset($groups[$participant['group']])) {
      $groups[$participant['group']] = [$participant]
    } else {
      $groups[$participant['group']][] = $participant;
    }
  }

  return_status(STATUS_OK, $groups);
});

register_method("POST", "/api/groups/", function ($matches) {
  $user = assert_auth();
  $body = get_json_body();
  $bookId = sql_esc(assert_uuid($matches[1]));

  assert_json_has($body, 'name');

  $book = get_notebook($user['id'], $bookId);

  assert_result($book, "Notebook not found!");

  $query = new InsertQuery('folders');

  $query->with_uuid()
    ->created_now()
    ->set('name', $body['name'])
    ->set_uuid('notebook', $bookId)
    ->set_optional('color', assert_color($body['color']))
    ->set_optional_uuid('parent', $body['parent'])
    ->run();

  if (!$query->success) {
    return_status(STATUS_BAD_REQUEST, "Could not create notebook");
  }

  $folderId = $query->getId();

  $noteId = (new InsertQuery('notes'))
    ->with_uuid()
    ->created_now()
    ->set('name', $body['name'])
    ->set('content', '')
    ->set_optional('color', assert_color($body['color']))
    ->set_uuid('folder', $folderId)
    ->run()->getid();

  sql("UPDATE folders SET note = UUID_TO_BIN('$noteId') WHERE id = UUID_TO_BIN('$folderId')");

  if ($query->success) {
    return_status(STATUS_CREATED, $query->fetch(['id', 'name', 'created', 'color', 'BIN_TO_UUID(parent)' => 'parent', 'BIN_TO_UUID(note)' => 'note']));
  } else {
    return_status(STATUS_BAD_REQUEST, "Could not create notebook");
  }

});

register_method("DELETE", "/api/groups/:group", function ($matches) {
  $user = assert_auth();
  $body = get_json_body();
  $bookId = sql_esc(assert_uuid($matches[1]));
  $folderId = sql_esc(assert_uuid($matches[2]));

  $book = get_notebook($user['id'], $bookId);

  assert_result($book, "Notebook not found!");

  $res = sql("DELETE FROM folders WHERE id = UUID_TO_BIN('$folderId') AND notebook = UUID_TO_BIN('$bookId') LIMIT 1");

  if ($res->affected_rows == 1) {
    return_status(STATUS_NO_CONTENT);
  } else {
    return_status(STATUS_NOT_FOUND, "Folder with id $folderId was not found on the server");
  }
});

register_method("POST", "/api/groups/:group", function ($matches) {
  $user = assert_auth();
  $body = get_json_body();
  $bookId = sql_esc(assert_uuid($matches[1]));
  $folderId = sql_esc(assert_uuid($matches[2]));

  $book = get_notebook($user['id'], $bookId);

  assert_result($book, "Notebook not found!");

  $query = new UpdateQuery('folders', $folderId);
  $query
    ->set_optional('name', $body['name'])
    ->set_optional('color', $body['color'])
    ->set_optional_uuid('parent', $body['parent'])
    ->set_optional_uuid('note', $body['note'])
    ->where("notebook = UUID_TO_BIN('$bookId')")
    ->run();

  if ($query->success) {
    return_status(STATUS_OK, $query->fetch(['id', 'name', 'created', 'color', 'BIN_TO_UUID(parent)' => 'parent', 'BIN_TO_UUID(note)' => 'note']));
  } else {
    return_status(500, "Error editing folder");
  }

});

?>
