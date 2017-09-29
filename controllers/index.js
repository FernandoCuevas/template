'use strict';
let articles = require('./ArticlesController');
let healthz = require('./HealthZ');

module.exports = [].concat(articles, healthz);