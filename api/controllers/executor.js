'use strict';

const ExecutorService = require('lib/executorService');
const DataSource = require('lib/models/DataSource');
const errorHandler = require('lib/utils/errorHandler');

function executeDataSource(req, res, next) {
    var id = req.swagger.params._id.value;
    var adapterProperties = req.swagger.params.adapterProperties.value;

    DataSource.findById(id,(err, ds)=>{
        if(err){
            errorHandler(res,err,500);
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