'use strict';

var fs = require('fs');
var path = require('path');
const logger = require('lib/utils/logger')('datasourceapi-adapters');
const mongoose = require('mongoose');

var adapters = {};

function loadAdapters() { // TODO validate adapter attributes when load. If not contains correctly all the attributes, doesn't load the adapter.
      adapters = {};
      logger.info('Loading Adapters...');
      var pathToLoad = path.join(appRoot, '/adapters');
      var files = fs.readdirSync(pathToLoad);
      for (var file of files) {
          var f = path.join(pathToLoad, file);
          delete require.cache[require.resolve(f)];
          var adapter = require(f);
          if(!adapter.disabled){
            adapters[adapter.name] = adapter;
            logger.debug(`Loaded ${adapter.displayName} (${adapter.name}).`);
          }          
      }      
      let count = Object.keys(adapters).length;
      logger.info(count + ' adapters loaded.');
      return count;
}

function getAdapters(){
    return adapters;
}

function getAdapter(adapter){
    return adapters[adapter];
}

loadAdapters();


function validateDataSourceProperties(adapter,datasourceProperties){
  var model = mongoose.model('Datasource Adapter properties',adapter.dataSourcePropertiesSchema);
  var props = new model(datasourceProperties);
  return props.validateSync(); // datasourceProperties are validated on create and update
}

function validateQueryProperties(adapter,queryProperties){
  var model = mongoose.model('Query Adapter properties',adapter.queryPropertiesSchema);
  var props = new model(queryProperties);
  return props.validateSync(); // queryProperties are validated on create, update and execute on demand
}

module.exports = {
    getAdapters,
    getAdapter,
    loadAdapters,
    validateDataSourceProperties,
    validateQueryProperties
}