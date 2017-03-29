'use strict';

var fs = require('fs');
var path = require('path');
const logger = require('./utils/logger')('polypus-adapters');
const mongoose = require('mongoose');
const Ajv = require('ajv');

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
  var ajv = new Ajv();
  var valid = ajv.validate(adapter.dataSourcePropertiesSchema,dataSourceProperties); // dataSourceProperties are validated on create and update
  if(!valid){
      return ajv.errors;
  }
  return ;
}

function validateQueryProperties(adapter,queryProperties){
  var ajv = new Ajv();
  var valid = ajv.validate(adapter.queryPropertiesSchema,queryProperties); // queryProperties are validated on create, update and execute on demand
  if(!valid){
      return ajv.errors;
  }
  return ;
}

module.exports = {
    getAdapters,
    getAdapter,
    loadAdapters,
    validateDataSourceProperties,
    validateQueryProperties
}