'use strict';

const ExecutorService = require('lib/executorService');
const DataSource = require('lib/models/DataSource');


function executeDataSource(req, res, next) {
    var id = req.swagger.params._id.value;
    var adapterProperties = req.swagger.params.adapterProperties.value;

    DataSource.findById(id,(err, ds)=>{
        ExecutorService.executeDataSource(ds, adapterProperties).then((data)=>{

        });
    });
    
}

function executeQuery(req, res, next) {
    
}

module.exports = {
    executeQuery : executeQuery,
    executeDataSource : executeDataSource,
};