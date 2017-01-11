'use strict';
const log4js = require('log4js');
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
        "[all]": "DEBUG"
    }
});
module.exports = (category) => log4js.getLogger(category);