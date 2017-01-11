'use strict';
require('rootpath')();
var SwaggerRestify = require('swagger-restify-mw');
var restify = require('restify');
var server = restify.createServer();

var yaml = require('yamljs');
var swaggerMongoose = require('swagger-mongoose');
var logger = require('logger');

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());

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

const erm = require('express-restify-mongoose');

module.exports = server; // for testing

const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://10.55.71.203/datasourceapi');

var swaggerDoc = JSON.stringify(yaml.load('./api/swagger/swagger.yaml'));

var DataSource = swaggerMongoose.compile(swaggerDoc).models.DataSource;
const uri = erm.serve(server, DataSource,{
  prefix: "api",
  name: "datasources",
  version: "",
  restify: true,
  findOneAndRemove: false,
  preDelete: (req, res, next)=>{
    if(!req.erm.document)
      return res.send(403,{});
    return next();
  }
});

var config = {
  appRoot: __dirname // required config
};
SwaggerRestify.create(config, function(err, swaggerRestify) {
  if (err) { throw err; }

  swaggerRestify.register(server);

  var port = process.env.PORT || 8080;
  server.listen(port,()=>{
    console.log("Listening on:",port);
  });

});
