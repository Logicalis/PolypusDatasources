'use strict';

const AdapterManager = require('lib/adapterManager');

function validateQuery(next){
    const DataSource = require('lib/models/DataSource');
    var doc = this;
    // check if DataSource exists
    DataSource.findById(doc.dataSource,'name adapter', (err,ds)=>{
        if(err){
            next(err);
            return;
        }
        if(!ds){
            next(new Error("DataSource doesn't exist."));
            return;
        }

        // check if queryProperties are valid to the adapter
        var error = AdapterManager.validateQueryProperties(AdapterManager.getAdapter(ds.adapter), doc.queryProperties);
        if(error){
            next(error);
          return;
        }

        next();
    });
  }

  module.exports = {
    validateQuery
  }