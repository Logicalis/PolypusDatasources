'use strict';

var configurationMap = {};
var statusMap = {};

const AdapterManager = require('lib/adapterManager');
const logger = require('lib/utils/logger')('executor-service');
const DataSource = require('lib/models/DataSource');
const co = require('co');

function _initExecutorService(){
    logger.info("Starting Executor Service, configuring datasources...");
    return new Promise((resolve,reject) => {
        DataSource.find({},(err,datasources) => {
            // all datasources will be configured sequentially
            co(function *(){
                for(let ds of datasources) {
                    yield configureDataSource(ds);
                }
                var statuses = getAllStatus();
                logger.debug("Executor service loaded, datasources status:");
                logger.debug(statuses);
                return statuses;
            }).then(resolve).catch((error) => {
                // ignore error, already will be printed
            });
        });
    });
    
}

var isLoadedPromise = _initExecutorService();

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

function executeDataSource(ds, queryProperties, parameters) {
    // TODO try to reconfigure if the configuration fails
    var adapter = AdapterManager.getAdapter(ds.adapter);
    queryProperties = adapter.replaceParams(queryProperties, parameters);
    var configuration = configurationMap[ds._id];
    logger.debug("Executing on DataSource: "+ds.name);
    logger.debug("Query properties: ");
    logger.debug(queryProperties);
    return adapter.execute(configuration, queryProperties);
}

function executeQuery(query, parameters) {
    var ds = query.dataSource;
    var adapter = AdapterManager.getAdapter(ds.adapter);

    var queryProperties = query.queryProperties;
    queryProperties = adapter.replaceParams(queryProperties, parameters);
    
    logger.debug("Executing Query "+query.name+" on " + ds.name);
    logger.debug("Query properties: ");
    logger.debug(queryProperties);

    var configuration = configurationMap[ds._id];
    return adapter.execute(configuration, queryProperties);
}

module.exports = {
    configureDataSource,
    getAllStatus,
    getStatus,
    executeDataSource,
    executeQuery,
    isLoadedPromise
}