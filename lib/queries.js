'use strict';

const erm = require('express-restify-mongoose');
var adapters = require('lib/adapterManager').adapters;
const mongoose = require('mongoose');

function validateQueryAdapterProperties(adapter,adapterProperties){
  var model = mongoose.model('Adapter properties',adapter.adapterProperties);
  var props = new model(adapterProperties);
  return props.validateSync();
}

const DataSource = require('./models/DataSource');
const Query = require('./models/Query');

module.exports = function (server){

var validateBody = function(req, res, next){
    // check if DataSource exists
    DataSource.findById(req.body.dataSource,'name adapter', (err,ds)=>{
        if(err){
            res.send(400, err);
            return;
        }
        if(!ds){
            res.send(400, new Error("DataSource doesn't exist."));
            return;
        }

        // TODO check adapterProperties

        next();
    });
  }

const uri = erm.serve(server, Query,{
  prefix: "api",
  name: "queries",
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