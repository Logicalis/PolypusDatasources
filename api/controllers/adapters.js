'use strict';

var adapterManager = require('lib/adapterManager');
const _ = require('lodash');

function get(req, res) {
  var list = [];
  _.forEach(adapterManager.getAdapters(), function(adapter){
    list.push(adapter);
  });
  res.send(200,list);
}

function reloadAdapters(req, res){
  try{
    let count = adapterManager.loadAdapters();
    res.send(200, {
      count: count
    });
  }
  catch(err){
    res.send(500,err);
  }
}


module.exports = {
  get: get,
  reloadAdapters: reloadAdapters
};