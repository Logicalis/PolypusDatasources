'use strict';

const erm = require('express-restify-mongoose');
var adapters = require('lib/adapterManager').getAdapters();
const mongoose = require('mongoose');
const errorHandler = require('lib/errorHandler');

const ExecutorService = require('lib/executorService');

function validateDataSourceAdapterProperties(adapter,adapterProperties){
  var model = mongoose.model('Adapter properties',adapter.adapterProperties);
  var props = new model(adapterProperties);
  return props.validateSync();
}

const DataSource = require('./models/DataSource');

module.exports = function (server){

function validateBody(req, res, next){
  // check if adapter exists
  var adapter = adapters[req.body.adapter];
  if(!adapter){
    res.send(400, new Error("Adapter doesn't exists: "+req.body.adapter));
    return;
  }
  // check if adapterProperties are valid to the adapter
  var error = validateDataSourceAdapterProperties(adapter, req.body.adapterProperties);
  if(error){
    errorHandler(res,error,400);
    return;
  }
  next();
}

  
function configureDataSource(req, res, next) {
  console.log(req.erm.result);
  ExecutorService.configureDataSource(req.erm.result);
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