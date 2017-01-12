'use strict';

var swaggerModels = require('./swaggerModels');
const erm = require('express-restify-mongoose');

module.exports = function (server){

const uri = erm.serve(server, swaggerModels.DataSource,{
  prefix: "api",
  name: "datasources",
  version: "",
  restify: true,
  findOneAndRemove: false,
  preDelete: (req, res, next)=>{
    if(!req.erm.document)
      return res.send(403,{});
    return next();
  }
});

}