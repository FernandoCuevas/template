/*creation script*/

DROP DATABASE IF EXISTS template;

CREATE DATABASE template;

\c template;

/* all ids are fragments (first 18 characters) of v4 uuids - generated in BaseRepository.js*/

CREATE TABLE users(
	id varchar(128) PRIMARY KEY,
	email varchar(128) UNIQUE NOT NULL,
	name varchar(128)  NOT NULL,
	password varchar(128) NOT NULL,
  scope varchar(128) NOT NULL,
  resetPasswordToken varchar(512),
	resetPasswordTimestamp bigint,
	created timestamp default current_timestamp
);


CREATE TABLE articles(
	id varchar(128) PRIMARY KEY,
	title varchar(128) NOT NULL,
	body varchar NOT NULL,
	created timestamp default current_timestamp
);    

GRANT USAGE ON SCHEMA public to template;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO template;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO template;