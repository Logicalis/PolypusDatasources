'use strict';

const Schema = require('mongoose').Schema;

function configure(dataSource){

    var configuration = {
        configuredAt: new Date(),
        dummy: dataSource.adapterProperties.dummyProperty,
        dataSource: dataSource
    }

    return configuration;
}


function execute(configuration, queryProperties){
    console.log("Execute query on dataSource:",configuration.dataSource.displayName);
    return {
        message: queryProperties.message,
        dummy: configuration.dummy
    }
}


module.exports = {
    displayName: "Dummy Adapter",
    name: "dummyAdapter",
    adapterProperties: new Schema({
        dummyProperty: Number
    }),
    queryProperties: new Schema({
        message: String
    }),
    execute: execute,
    configure: configure
}