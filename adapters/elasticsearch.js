'use strict';

const Schema = require('mongoose').Schema;

const elasticsearch = require('elasticsearch');
const paramReplacer = require('lib/utils/paramReplacer');

function configure(dataSource){
    var props = dataSource.dataSourceProperties;
    var client = new elasticsearch.Client({
        host: props.url,
        log: "info"
    });

    return client.ping({
        requestTimeout: 30000
    }).then(() => {
        return Promise.resolve({client, index: props.index});
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
    queryProperties.query = paramReplacer(queryProperties.query, parameters);
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
    additionalProperties:{}
}