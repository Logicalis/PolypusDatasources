'use strict';

const erm = require('express-restify-mongoose');
const DataSource = require('./models/DataSource');

module.exports = function (server){

const Service = require('lib/dataSourceService');

function preDelete(req,res,next){
  var id = req.params.id;
  var removeQueries = req.params.removeQueries;
  if(removeQueries === "true"){
    Service.removeQueries(id);
  }
  next();
}

const uri = erm.serve(server, DataSource,{
  prefix: "api",
  name: "datasources",
  version: "",
  restify: true,
  findOneAndRemove: false,
  findOneAndUpdate: false,
  preDelete: [(req, res, next)=>{ // Prevent DELETE all entities
    if(!req.erm.document)
      return res.send(403,{});
    return next();
  },
  preDelete]
});

}