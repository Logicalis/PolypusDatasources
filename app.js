'use strict';

require('rootpath')();

var path = require('path');
var config = require('./config');

require('lib/utils/logger')('datasourceapi')
    .debug(`Starting DataSourceAPI with the following settings: ${JSON.stringify(config)}`);

var SwaggerRestify = require('swagger-restify-mw');
var restify = require('restify');
var server = restify.createServer();

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());

var adaptersController = require('api/controllers/adapters');
server.get('/api/adapters', adaptersController.get);

var executorController = require('api/controllers/executor');
server.get('/api/datasources/status', executorController.getAllStatus);

function corsHandler(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD');
  return next();
}

// Fix Swagger OPTIONS request
server.opts(/\.*/,corsHandler,function(req,res,next){
  res.send(200);
  return next();
});


module.exports = server; // for testing

const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URL || config.mongodb.url);

require('lib/datasourceController')(server);
require('lib/queriesController')(server);

var configswagger = {
  appRoot: __dirname // required config
};
SwaggerRestify.create(configswagger, function(err, swaggerRestify) {
  if (err) { throw err; }

  swaggerRestify.register(server);

  var port = process.env.PORT || config.http.port || 8080;
  server.listen(port,()=>{
    console.log("Listening on:",port);
  });

});
