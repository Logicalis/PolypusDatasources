'use strict';

const Schema = require('mongoose').Schema;
const pg = require('pg');
const paramReplacer = require('lib/utils/paramReplacer');

function configure(dataSource){
    var props = dataSource.dataSourceProperties;
    var config = Object.assign({},props);
    config.max = config.maxClientsPool;
    delete config.maxClientsPool;

    var pool = new pg.Pool(config);
    return Promise.resolve(pool);
}


function execute(pool, queryProperties){
    return new Promise((resolve, reject) => {
        pool.connect((err,client,done) => {
            if(err){
                reject(err);
                return;
            }
            client.query(queryProperties.query,(err, result) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(result);
            });
        }); 
    });   
}

function replaceParams(queryProperties, parameters) {
    queryProperties.query = paramReplacer(queryProperties.query, parameters);
    return queryProperties;
}

module.exports = {
    displayName: "PostgreSQL",
    name: "postgresql",
    dataSourcePropertiesSchema:{
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "title": "PostgreSQL Connection",
        "properties": {
            "user": {
                "type": "string",
                "title":"User"
            },
            "password": {
                "type": "string",
                "title":"Password"
            },
            "database": {
                "type": "string",
                "title":"Database"
            },
            "host": {
                "type": "string",
                "title": "Host"
            },
            "port": {
                "type": "integer",
                "title": "Port",
                "default": 5432
            },
            "maxClientsPool": {
                "type": "integer",
                "title":"Max Clients in Pool",
                "default": 10
            },
            "idleTimeoutMillis": {
                "type": "integer",
                "title": "Idle Timeout Millis",
                "default": 30000
            }
        },
        "required": [
            "user",
            "password",
            "database",
            "host"
        ]
    },
    queryPropertiesSchema: {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "title": "PostgreSQL Query",
        "properties": {
            "query": {
                "type": "string",
                "title":"SQL Query",
                "ui:widget": "textarea"
            }
        },
        "required": [
            "query"
        ]
    },
    execute,
    configure,
    replaceParams,
    additionalProperties:{}
}