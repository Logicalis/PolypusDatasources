'use strict';

var yaml = require('yamljs');
var swaggerMongoose = require('swagger-mongoose');

var swaggerDoc = JSON.stringify(yaml.load('./api/swagger/swagger.yaml'));

module.exports = swaggerMongoose.compile(swaggerDoc).models;