<?php

class UpdateQuery {
  private $table = "";
  private $values = [];
  private $conditions = [];
  private $id = null;
  public $query = "";
  public $success = false;
  public $error = "query was not executed";

  public function __construct($table, $id) {
    $this->table = $table;
    $this->id = $id;
    $this->conditions[] = "id = UUID_TO_BIN('$this->id')";
  }

  public function set_uuid($field, $id) {
    return $this->set_sql($field, "UUID_TO_BIN('" . sql_esc($id) . "')");
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

    $this->values[$field] = "'".sql_esc($value)."'";
    return $this;
  }

  public function set_sql($field, $value) {
    $this->values[$field] = $value;
    return $this;
  }

  public function where($condition) {
    $this->conditions[] = $condition;
    return $this;
  }

  public function run() {
    $updates = [];

    foreach($this->values as $field => $value) {
      $updates[] = "`$field` = $value";
    }

    $query = 'UPDATE `'.$this->table.'` SET ' . implode(", ", $updates) . ' WHERE ' . implode(" AND ", $this->conditions) . ' LIMIT 1';

    $this->query = $query;

    $res = sql($query);

    $this->success = $res->errno == 0;
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
}



?>
