'use strict';

const erm = require('express-restify-mongoose');
var adapters = require('lib/adapterManager').getAdapters();
const mongoose = require('mongoose');

function validateQueryProperties(adapter,queryProperties){
  var model = mongoose.model('Adapter properties',adapter.queryProperties);
  var props = new model(queryProperties);
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

        // check if adapterProperties are valid to the adapter queryProperties
        var error = validateQueryProperties(adapters[ds.adapter], req.body.adapterProperties);
        if(error){
          res.send(400, JSON.parse(JSON.stringify(error))); // hack to send the all error data in json format not just the message
          return;
        }

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