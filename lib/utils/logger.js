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

const logger_dir = process.env.LOGGER_DIR || config.logger.dir;

( !fileOrDirExists(logger_dir) && mkdir(logger_dir) ); // Create logger dir if not exists

log4js.configure({
    "appenders": [
        {
            "type": "dateFile",
            "absolute": true,
            "filename": logger_dir,
            "pattern": "yyyy-MM-dd.log",
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