CREATE USER IF NOT EXISTS 'criticalmass'@'localhost' IDENTIFIED BY 'password';

CREATE DATABASE criticalmass;

GRANT ALL ON criticalmass.* to 'criticalmass'@'localhost';

USE criticalmass;

DROP TABLE IF EXISTS groups;

CREATE TABLE groups (
  `id` VARCHAR(32) NOT NULL PRIMARY KEY,
  `address` VARCHAR(128) NOT NULL,
  `time` INT(11) NOT NULL,
  `creator` VARCHAR(32) NOT NULL
);

DROP TABLE IF EXISTS participations;

CREATE TABLE participations (
  `group` VARCHAR(32) NOT NULL,
  `uid` VARCHAR(32) NOT NULL,
  `name` VARCHAR(128) NOT NULL
);
