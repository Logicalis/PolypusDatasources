'use strict';

const erm = require('express-restify-mongoose');
var adapters = require('lib/adapterManager').adapters;
const mongoose = require('mongoose');

function validateDataSourceAdapterProperties(adapter,adapterProperties){
  var model = mongoose.model('Adapter properties',adapter.adapterProperties);
  var props = new model(adapterProperties);
  return props.validateSync();
}

module.exports = function (server){


var dataSourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index:true,
    unique: true,
    trim: true
  },
  adapter: {
    type: String,
    required: true,
    trim: true
  },
  adapterProperties:{
    type: Object
  }
}, {timestamps: {}});

var DataSource = mongoose.model('DataSource',dataSourceSchema);

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
  preCreate: (req, res, next)=>{
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


});

}