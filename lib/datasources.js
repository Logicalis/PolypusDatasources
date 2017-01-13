'use strict';

const erm = require('express-restify-mongoose');
var adapters = require('lib/adapterManager').getAdapters();
const mongoose = require('mongoose');

function validateDataSourceAdapterProperties(adapter,adapterProperties){
  var model = mongoose.model('Adapter properties',adapter.adapterProperties);
  var props = new model(adapterProperties);
  return props.validateSync();
}

const DataSource = require('./models/DataSource');

module.exports = function (server){

var validateBody = function(req, res, next){
    // check if adapter exists
    var adapter = adapters[req.body.adapter];
    if(!adapter){
      res.send(400, new Error("Adapter doesn't exists: "+req.body.adapter));
      return;
    }
    // check if adapterProperties are valid to the adapter
    var error = validateDataSourceAdapterProperties(adapter, req.body.adapterProperties);
    if(error){
      res.send(400, JSON.parse(JSON.stringify(error))); // hack to send the all error data in json format not just the message
      return;
    }
    next();
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
  preUpdate: validateBody


});

}