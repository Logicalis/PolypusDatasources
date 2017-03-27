'use strict';

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
    dataSourcePropertiesSchema: {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "title": "ElasticSearch connection",
        "type": "object",
        "properties": {
            "url": {
                "type": "string",
                "title": "URL"
            },
            "index": {
                "type": "string",
                "title": "Index"
            }
        },
        "required": [
            "url",
            "index"
        ]
    },
    queryPropertiesSchema: {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "title": "Elasticsearch Query ",
        "type": "object",
        "properties": {
            "type": {
                "type": "string",
                "title": "Type"
            },
            "query": {
                "type": "string",
                "title": "Query",
                "ui:widget": "textarea"
            }
        },
        "required": [
            "type",
            "query"
        ]
    },
    execute,
    configure,
    replaceParams,
    additionalProperties:{}
}