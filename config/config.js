// check env
var env = process.env.NONE_ENV || 'development';
// fetch env.con
var config = require('./config.json');
var envConfig = config[env];
// add env. config values to process.env
Object.keys(envConfig).forEach(key => process.env[key] = envConfig[key]);
