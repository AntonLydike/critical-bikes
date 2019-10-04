CREATE USER IF NOT EXISTS 'criticalmass'@'localhost' IDENTIFIED BY 'password';

CREATE DATABASE criticalmass;

GRANT ALL ON criticalmass.* to 'criticalmass'@'localhost';

USE criticalmass;

DROP TABLE IF EXISTS groups;

CREATE TABLE groups (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `description` varchar(1024) NOT NULL,
  `address` VARCHAR(128) NOT NULL,
  `lat` DECIMAL(10, 8) NOT NULL,
  `lon` DECIMAL(11, 8) NOT NULL,
  `time` INT(11) NOT NULL,
  `creator` VARCHAR(36) NOT NULL
);

DROP TABLE IF EXISTS participations;

CREATE TABLE participations (
  `group` VARCHAR(36) NOT NULL,
  `uid` VARCHAR(36) NOT NULL,
  `name` VARCHAR(128) NOT NULL,

  PRIMARY KEY (`group`, `uid`),
  CONSTRAINT fk_group FOREIGN KEY (`group`) REFERENCES `groups`(`id`) ON DELETE CASCADE
);
