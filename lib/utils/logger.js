'use strict';
const log4js = require('log4js');
const config = require('../../config');

log4js.configure({
    "appenders": [
        {
            "type": "dateFile",
            "absolute": true,
            "filename": process.env.LOGGER_DIR || config.logger.dir,
            "pattern": "datasourceapi-yyyy-MM-dd.log",
            "alwaysIncludePattern": true
        },
        {
            "type": "console"
        }
    ],
    "replaceConsole": true,
    "levels": {
        "[all]": process.env.LOGGER_LEVEL || config.logger.level
    }
});
module.exports = (category) => log4js.getLogger(category);