'use strict';

const ExecutorService = require('lib/executorService');
const DataSource = require('lib/models/DataSource');
const errorHandler = require('lib/utils/errorHandler');
const AdapterManager = require('lib/adapterManager');

function executeDataSource(req, res, next) {
    var id = req.swagger.params._id.value;
    var bodyParams = req.swagger.params.bodyParams.value;
    var adapterProperties = bodyParams.adapterProperties;
    var parameters = bodyParams.parameters; // TODO replace Params

    DataSource.findById(id,(err, ds)=>{
        if(err){
            errorHandler(res,err,400); // dataSource not found
            return;
        }
        var validateError = AdapterManager.validateQueryProperties(AdapterManager.getAdapter(ds.adapter),adapterProperties);
        if(validateError){
          errorHandler(res,validateError,400); // invalid adapterProperties for query
          return;
        }
        ExecutorService.executeDataSource(ds, adapterProperties).then((data)=>{
            res.send(200, {data});
        }).catch((err)=>{
            var status = 500;
            if(err.type == "adapterProperties"){ // Bad request on adapterProperties
                status = 400;
            }
            errorHandler(res,err,status);
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