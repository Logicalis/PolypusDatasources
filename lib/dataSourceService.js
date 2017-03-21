'use strict';

const AdapterManager = require('lib/adapterManager');

function validateDataSource(next){
  var doc = this;
  // check if adapter exists
  var adapter = AdapterManager.getAdapter(doc.adapter);
  if(!adapter){
    next(new Error("Adapter doesn't exists: "+doc.adapter));
    return;
  }
  // check if dataSourceProperties are valid to the adapter
  var errors = AdapterManager.validateDataSourceProperties(adapter, doc.dataSourceProperties);
  if(errors){
    next(errors);
    return;
  }
  next();
}

function configureDataSource(doc) {
  var ExecutorService = require('lib/executorService'); // require is here to prevent circular dependency
  ExecutorService.configureDataSource(doc).then((status) => {
    // res.send(200,status);
  }).catch((status) => {
    // var statusJson = Object.assign({},status, {error: status.error.toString()});
    // res.send(500, statusJson);
  });
}

const Query = require('./models/Query');

function removeQueries(dataSourceId){
  return new Promise((resolve,reject) => {
    Query.remove({dataSource: dataSourceId}).exec((error) => {
        if(error){
          reject(error);
          return;
        }
        resolve();
    });
  });
}

module.exports = {
    validateDataSource,
    configureDataSource,
    removeQueries
}