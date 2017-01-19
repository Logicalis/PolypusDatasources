'use strict';

var adapterManager = require('lib/adapterManager');
const _ = require('lodash');

function get(req, res) {
  var list = [];
  _.forEach(adapterManager.getAdapters(), function(adapter){
    var adapterJson = Object.assign({},adapter);
    adapterJson.dataSourcePropertiesSchema = adapterJson.dataSourcePropertiesSchema.paths;
    delete adapterJson.dataSourcePropertiesSchema._id;
    adapterJson.queryPropertiesSchema = adapterJson.queryPropertiesSchema.paths;
    delete adapterJson.queryPropertiesSchema._id;
    list.push(adapterJson);
  });
  res.send(200,list);
}

function reloadAdapters(req, res){
  try{
    let count = adapterManager.loadAdapters();
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