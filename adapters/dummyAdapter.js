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
    disabled: false,
    displayName: "Dummy Adapter",
    name: "dummyAdapter",
    adapterProperties: new Schema({
        dummyProperty: {
            type: Number,
            required: [true, "You must have the dummy property, it's just dummy. Why not?"]
        }
    }),
    queryProperties: new Schema({
        message: {
            type: String,
            required: [true, "Put some message in the query please. I'm a dummy adapter"]
        }
    }),
    execute: execute,
    configure: configure
}