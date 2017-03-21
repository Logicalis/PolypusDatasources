'use strict';

const paramReplacer = require('lib/utils/paramReplacer');

function configure(dataSource){

    if(dataSource.dataSourceProperties.dummyProperty < 15){ // just to test errors
        return Promise.reject(new Error("Dummy property must be >= 15"));
    }

    var configuration = {
        configuredAt: new Date(),
        dummy: dataSource.dataSourceProperties.dummyProperty,
        dataSource: dataSource
    }

    return Promise.resolve(configuration);
}


function execute(configuration, queryProperties){
    console.log("Execute query on dataSource:",configuration.dataSource.name);
    return Promise.resolve({
        message: queryProperties.message,
        dummy: configuration.dummy
    });
}

function replaceParams(queryProperties, parameters) {
    queryProperties.message = paramReplacer(queryProperties.message, parameters);
    return queryProperties;
}

module.exports = {
    // disabled: true,
    displayName: "Dummy Adapter",
    name: "dummyAdapter",
    dataSourcePropertiesSchema: {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "title": "Dummy Adapter Properties",
        "description": "",
        "type": "object",
        "properties": {
            "dummyProperty": {
                "type": "number",
                "title": "Dummy Property",
                "ui:widget": "updown"
            }
        },
        "required": ['dummyProperty']
    },
    queryPropertiesSchema:{
        "$schema": "http://json-schema.org/draft-04/schema#",
        "title": "Dummy Adapter Properties",
        "description": "",
        "type": "object",
        "properties": {
            "message": {
                "type": "string",
                "title": "Message"
            }
        },
        "required": ["message"]
    },
    execute,
    configure,
    replaceParams,
    additionalProperties:{
        nothing: "here"
    }
}