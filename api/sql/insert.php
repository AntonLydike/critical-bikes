<?php

class InsertQuery {
  private $table = "";
  private $values = [];
  private $id = null;
  public $success = false;
  public $query = "";
  public $error = "query was not executed";

  public function __construct($table) {
    $this->table = $table;
  }

  public function with_uuid() {
    return $this->set_uuid('id', uuidv4());
  }

  public function set_uuid($field, $id) {
    if ($field == 'id') {
      $this->id = $id;
    }
    $this->set_sql($field, "UUID_TO_BIN('" . sql_esc($id) . "')");

    return $this;
  }

  public function created_now() {
    return $this->set('created', sql_now());
  }

  public function set_optional($field, $value) {
    if (!isset($value) || is_null($value)) return $this;

    return $this->set($field, $value);
  }

  public function set_optional_uuid($field, $value) {
    if (!isset($value) || is_null($value)) return $this;

    return $this->set_uuid($field, $value);
  }

  public function set_null($field) {
    return $this->set_sql($field, 'NULL');
  }

  public function set($field, $value) {
    if (!isset($value) || is_null($value)) return $this->set_null($field);

    $this->values[sql_esc($field)] = "'".sql_esc($value)."'";
    return $this;
  }

  public function set_sql($field, $value) {
    $this->values[sql_esc($field)] = $value;
    return $this;
  }

  public function run() {
    $fields = [];
    $values = [];

    foreach($this->values as $field => $value) {
      $fields[] = $field;
      if (is_null($value)) {
        $values[] = 'NULL';
      } else {
        $values[] = $value;
      }
    }

    $query = 'INSERT INTO `'.$this->table.'`(`' . implode('`, `', $fields) .'`) VALUES (' . implode(', ', $values) . ')';

    $this->query = $query;

    $res = sql($query);

    $this->success = $res->affected_rows == 1;
    $this->error = $res->error;

    return $this;
  }

  public function fetch($fields) {
    $sql_fields = [];

    foreach($fields as $key => $value) {
      if (is_numeric($key) && $value == 'id') {
        $sql_fields[] = "BIN_TO_UUID(id) as `id`";
      } else if (is_numeric($key)) {
        $sql_fields[] =  "`$value`";
      } else {
        $sql_fields[] =  "$key as `$value`";
      }
    }

    $sql_fields = implode(", ", $sql_fields);

    return sql("SELECT $sql_fields FROM `$this->table` WHERE id = UUID_TO_BIN('$this->id')")[0];
  }

  public function getId() {
    return $this->id;
  }
}



?>
