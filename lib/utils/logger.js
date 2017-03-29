'use strict';
const log4js = require('log4js');
const config = require('../../config');

const fs = require('fs');
const mkdirp = require('mkdirp');

function fileOrDirExists(filePath) {
    try {
        return fs.statSync(filePath).isFile() || fs.statSync(filePath).isDirectory();
    }
    catch (err) {
        return false;
    }
};
function mkdir(dir) {
    mkdirp(dir, (err) => {if (err) throw err});
};
( !fileOrDirExists(config.logger.dir) && mkdir(config.logger.dir) ); // Create logger dir if not exists

log4js.configure({
    "appenders": [
        {
            "type": "dateFile",
            "absolute": true,
            "filename": process.env.LOGGER_DIR || config.logger.dir,
            "pattern": "polypus-yyyy-MM-dd.log",
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