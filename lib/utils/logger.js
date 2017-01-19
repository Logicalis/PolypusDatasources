'use strict';
const log4js = require('log4js');
const config = require('../../config');

log4js.configure({
    "appenders": [
        {
            "type": "dateFile",
            "absolute": true,
            "filename": "./datasourceapi.log",
            "pattern": "-yyyy-MM-dd",
            "alwaysIncludePattern": false
        },
        {
            "type": "console"
        }
    ],
    "replaceConsole": true,
    "levels": {
        "[all]": config.logger.level
    }
});
module.exports = (category) => log4js.getLogger(category);