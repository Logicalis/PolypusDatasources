'use strict';

const Schema = require('mongoose').Schema;

const elasticsearch = require('elasticsearch');

function configure(dataSource){
    var props = dataSource.dataSourceProperties;
    var client = new elasticsearch.Client({
        host: props.url,
        log: "info"
    });

    return client.ping({
        requestTimeout: 30000
    }).then(() => {
        return Promise.resolve({client, index: dataSource.index});
    });
}


function execute(configuration, queryProperties){
    return configuration.client.search({
        index: configuration.index,
        type: queryProperties.type,
        body: queryProperties.query
    });
}

function replaceParams(queryProperties, parameters) {
    var regex = /\$\{[ ]*([^ ]+)[ ]*\}/g;
    queryProperties.message = queryProperties.query.replace(regex,(param, key, offset, string) => {
        return parameters[key] || "";
    });
    return queryProperties;
}

module.exports = {
    displayName: "Elasticsearch",
    name: "elasticsearch",
    dataSourcePropertiesSchema: new Schema({
        url: {
            type: String,
            required: [true, "You must set the Elasticsearch instance URL to connect. E.g. 'localhost:9200'"]
        },
        index: {
            type: String,
            required: [true, "You must set the 'index' to connect."]
        }
    }),
    queryPropertiesSchema: new Schema({
        type: {
            type: String,
            required: [true, "You must set the Elasticsearch type to query."]
        },
        query: {
            type: String,
            required: [true, "You must set the Elasticsearch query object."]
        }
    }),
    execute,
    configure,
    replaceParams,
    aditionalProperties:{}
}