'use strict';
const config = {};

config.app = {};
config.app.port = 8484;
config.app.secret = 'ojf3lbd0K5gks9n86o9S213Ffimxl921zwfccKHGf'; //jwt signing secret //TODO modify this on deploy

config.database = {};
let db_vendor = 'postgres';
let db_host = 'localhost';
//DEV
let db_user = 'fer';
let db_name = 'template';
let db_password = process.env.SERVICE_DB_PASSWORD || 'fer';
config.database.conn_string = db_vendor + '://' + db_user + ':' + db_password + '@' + db_host + '/' + db_name;

module.exports = config;