'use strict';

const Schema = require('mongoose').Schema;
const request = require('request');
const paramReplacer = require('lib/utils/paramReplacer');

function configure(dataSource){
    var props = dataSource.dataSourceProperties;
    return Promise.resolve(props);
}

function execute(dataSourceProperties, queryProperties){
    var url = dataSourceProperties.url+queryProperties.urlEnd;
    var headers = JSON.parse(dataSourceProperties.headers);
    return new Promise((resolve, reject) => {
        request.get({url,headers}, (err, response, body) => {
            if(err){
                reject(err);
                return;
            }
            if(response.getContentType() === "application/json"){
                body = JSON.parse(body);
            }
            resolve({
                status: response.statusCode,
                body
            })
        })
    });   
}

function replaceParams(queryProperties, parameters) {
    queryProperties.urlEnd = paramReplacer(queryProperties.urlEnd, parameters);
    return queryProperties;
}

module.exports = {
    displayName: "HTTP Request",
    name: "httprequest",
    dataSourcePropertiesSchema: {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "title": "HTTP API",
        "properties": {
            "url": {
                "type": "string",
                "title": "URL"
            },
            "headers": {
                "type": "string",
                "title": "Headers",
                "default":"{}",
                "ui:widget": "textarea"
            }
        },
        "required": [
            "url"
        ]
    },
    queryPropertiesSchema: {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "title": "HTTP API Endpoint",
        "properties": {
            "urlEnd": {
                "type": "string",
                "title": "URL Endpoint",
                "description": "The rest of the URL after the DataSource url.",
                "default":""
            }
        }
    },
    execute,
    configure,
    replaceParams,
    additionalProperties:{}
}