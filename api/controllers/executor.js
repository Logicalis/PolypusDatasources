'use strict';

const ExecutorService = require('lib/executorService');
const DataSource = require('lib/models/DataSource');
const errorHandler = require('lib/utils/errorHandler');
const AdapterManager = require('lib/adapterManager');

function executeDataSource(req, res, next) {
    var id = req.swagger.params._id.value;
    var bodyParams = req.swagger.params.bodyParams.value;
    var queryProperties = bodyParams.queryProperties;
    var parameters = bodyParams.parameters; // TODO replace Params

    DataSource.findById(id,(err, ds)=>{
        if(err){
            errorHandler(res,err,400); // dataSource not found
            return;
        }
        var validateError = AdapterManager.validateQueryProperties(AdapterManager.getAdapter(ds.adapter),queryProperties);
        if(validateError){
          errorHandler(res,validateError,400); // invalid queryProperties for adapter
          return;
        }
        ExecutorService.executeDataSource(ds, queryProperties).then((data)=>{
            res.send(200, {data});
        }).catch((err)=>{
            errorHandler(res,err);
        });
    });
    
}

function executeQuery(req, res, next) {
    // TODO
}

function getAllStatus(req, res, next) {
    res.send(200, ExecutorService.getAllStatus());
}

function getStatus(req, res, next) {
    res.send(200, ExecutorService.getStatus(req.swagger.params._id.value));
}

module.exports = {
    executeQuery,
    executeDataSource,
    getAllStatus,
    getStatus
};