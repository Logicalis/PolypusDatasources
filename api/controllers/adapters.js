'use strict';

var fs = require('fs');
var path = require('path');
const logger = require('logger')('datasourceapi-adapters');
const _ = require('lodash');
var adapters = {};

function loadAdapters() {
      logger.info('Loading Adapters...');
      var pathToLoad = path.join(__dirname, '../../adapters');
      var files = fs.readdirSync(pathToLoad);
      for (var file of files) {
          var f = path.join(pathToLoad, file);
          var adapter = require(f);
          adapters[adapter.name] = adapter;
          logger.debug(`Loaded ${adapter.displayName} (${adapter.name}).`);
      }      
      let count = Object.keys(adapters).length;
      logger.info(count + ' adapters loaded.');
      return count;
}


loadAdapters();

function get(req, res) {
  var list = [];
  _.forEach(adapters, function(adapter){
    var adapterJson = Object.assign({},adapter);
    adapterJson.adapterProperties = adapterJson.adapterProperties.paths;
    delete adapterJson.adapterProperties._id;
    adapterJson.queryProperties = adapterJson.queryProperties.paths;
    delete adapterJson.queryProperties._id;
    list.push(adapterJson);
  });
  res.json(list);
}

function reloadAdapters(req, res){
  try{
    let count = loadAdapters();
    res.send(200, {
      count: count
    })
  }
  catch(err){
    res.send(500,err);
  }
}


module.exports = {
  get: get,
  reloadAdapters: reloadAdapters
};