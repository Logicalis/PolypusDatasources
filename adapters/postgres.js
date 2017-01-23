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
    dataSourcePropertiesSchema: new Schema({
        user: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        database: {
            type: String,
            required: true
        },
        host: {
            type: String,
            required: true
        },
        port: {
            type: Number,
            default: 5432
        },
        maxClientsPool: {
            type: Number,
            default: 10
        },
        idleTimeoutMillis: {
            type: Number,
            default: 30000
        }        
    }),
    queryPropertiesSchema: new Schema({
        query: {
            type: String,
            required: [true, "You must set the SQL query."]
        }
    }),
    execute,
    configure,
    replaceParams,
    additionalProperties:{}
}