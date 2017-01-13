'use strict';

var adapterManager = require('lib/adapterManager');
const _ = require('lodash');

function get(req, res) {
  var list = [];
  _.forEach(adapterManager.getAdapters(), function(adapter){
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