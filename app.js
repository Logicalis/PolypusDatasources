'use strict';

require('rootpath')();

var path = require('path');
const os = require('os');
var config = require('./config');

const DEFAULT_PID_PATH = '/var/run/polypus/';

const mkdirp = require('mkdirp');
const fs = require('fs');

function writePIDFile() {
    const dirPath = config.process.pid_file_path || DEFAULT_PID_PATH;
    const pidFilePath = path.join(dirPath, 'polypus.pid');
    mkdirp.sync(dirPath);
    fs.writeFile(pidFilePath, process.pid);
}

// write PID file if OS is UNIX
if (os.platform() === 'linux') {
    writePIDFile();
}

require('lib/utils/logger')('polypus')
    .debug(`Starting Polypus with the following settings: ${JSON.stringify(config)}`);

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


const unflatten = require('flat').unflatten;
const YAML = require('yamljs');

try {
  var swaggerObject = unflatten(YAML.load(path.resolve(__dirname,'./api/swagger/swagger.yaml')));
  swaggerObject.basePath = process.env.BASEPATH || config.basePath || swaggerObject.basePath; // allow to change basepath via Env or Config. To use behind a nginx url for instance
} catch (err) {
  console.log(err);
}

// serving the swagger.yaml file to change the basePath according to configuration allowing to server under proxy servers.
server.get('/api/swagger',(req,res,next) => {
  res.json(200,swaggerObject);
});

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

// serve static admin web interface
server.get(/\/?.*/, restify.serveStatic({
      directory: __dirname+'/admin',
      default: 'index.html'
}));