'use strict';

var configurationMap = {};
var statusMap = {};

const AdapterManager = require('lib/adapterManager');
const logger = require('lib/utils/logger')('executor-service');
const DataSource = require('lib/models/DataSource');

function initExecutorService(){
    logger.info("Starting Executor Service, configuring datasources...");
    DataSource.find({},(err,datasources) => {
        // all datasources will be configured asynchronously
        for(let ds of datasources) {
            configureDataSource(ds).catch((error) => {
                // ignore error, already will be printed
            });
        }
    });
}

initExecutorService();

function Status(ok, error){
    return {ok, error, date: new Date()};
}

function configureDataSource(ds) {
    // remove any configurations before, if the datasource was updated and need to be reconfigured
    delete configurationMap[ds._id];
    var adapter = AdapterManager.getAdapter(ds.adapter);

    return adapter.configure(ds).then((configuration)=>{
        configurationMap[ds._id] = configuration;
        statusMap[ds._id] = Status(true);
        logger.info(ds.name + ' Configured with success.');
        return Promise.resolve(statusMap[ds._id]);
    }).catch((error) => {
        statusMap[ds._id] = Status(false, error);
        logger.error('Error on configure '+ds.name);
        logger.error(error);
        return Promise.reject(statusMap[ds._id]);
    });
}

function getAllStatus(){
    return statusMap;
}

function getStatus(ds_id){
    return statusMap[ds_id];
}

function executeDataSource(ds, adapterProperties) {
    // TODO try to reconfigure if the configuration fails
    var adapter = AdapterManager.getAdapter(ds.adapter);
    var configuration = configurationMap[ds._id];
    return adapter.execute(configuration,adapterProperties);
}

module.exports = {
    configureDataSource,
    getAllStatus,
    getStatus,
    executeDataSource
}