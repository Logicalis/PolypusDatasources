'use strict';

const erm = require('express-restify-mongoose');
const Query = require('./models/Query');

module.exports = function (server){

const uri = erm.serve(server, Query,{
  prefix: "api",
  name: "queries",
  version: "",
  restify: true,
  findOneAndRemove: false,
  findOneAndUpdate: false,
  preDelete: (req, res, next)=>{ // Prevent DELETE all entities
    if(!req.erm.document)
      return res.send(403,{});
    return next();
  }
});

}