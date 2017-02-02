'use strict';

var fs = require('fs');
var path = require('path');
const logger = require('./utils/logger')('datasourceapi-adapters');
const mongoose = require('mongoose');

var adapters = {};
var dataSourcePropertiesModels = {};
var queryPropertiesModels = {};

function loadAdapters() { // TODO validate adapter attributes when load. If not contains correctly all the attributes, doesn't load the adapter.
      adapters = {};
      dataSourcePropertiesModels = {};
      queryPropertiesModels = {};
      logger.info('Loading Adapters...');
      var pathToLoad = path.join(__dirname,'../adapters');
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


function validateDataSourceProperties(adapter,dataSourceProperties){
  if(!dataSourcePropertiesModels[adapter.name]){
      dataSourcePropertiesModels[adapter.name] = mongoose.model('dataSourceProperties '+adapter.name,adapter.dataSourcePropertiesSchema);
  }
  var model = dataSourcePropertiesModels[adapter.name];
  var props = new model(dataSourceProperties);
  return props.validateSync(); // dataSourceProperties are validated on create and update
}

function validateQueryProperties(adapter,queryProperties){
  if(!queryPropertiesModels[adapter.name]){
      queryPropertiesModels[adapter.name] = mongoose.model('queryProperties '+adapter.name,adapter.queryPropertiesSchema);
  }
  var model = queryPropertiesModels[adapter.name];
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