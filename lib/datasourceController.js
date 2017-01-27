'use strict';

const erm = require('express-restify-mongoose');
var AdapterManager = require('lib/adapterManager');
const errorHandler = require('lib/utils/errorHandler');

const ExecutorService = require('lib/executorService');

const DataSource = require('./models/DataSource');

module.exports = function (server){

function validateBody(req, res, next){
  // check if adapter exists
  var adapter = AdapterManager.getAdapter(req.body.adapter);
  if(!adapter){
    res.send(400, new Error("Adapter doesn't exists: "+req.body.adapter));
    return;
  }
  // check if dataSourceProperties are valid to the adapter
  var error = AdapterManager.validateDataSourceProperties(adapter, req.body.dataSourceProperties);
  if(error){
    errorHandler(res,error,400);
    return;
  }
  next();
}

  
function configureDataSource(req, res, next) {
  ExecutorService.configureDataSource(req.erm.result).then((status) => {
    // res.send(200,status);
  }).catch((status) => {
    // var statusJson = Object.assign({},status, {error: status.error.toString()});
    // res.send(500, statusJson);
  });
  res.send(req.erm.result);
}

const uri = erm.serve(server, DataSource,{
  prefix: "api",
  name: "datasources",
  version: "",
  restify: true,
  findOneAndRemove: false,
  preDelete: (req, res, next)=>{ // Prevent DELETE all entities
    if(!req.erm.document)
      return res.send(403,{});
    return next();
  },
  preCreate: validateBody,
  preUpdate: validateBody,
  postCreate: configureDataSource,
  postUpdate: configureDataSource
});

}