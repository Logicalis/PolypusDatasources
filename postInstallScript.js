const fs = require('fs');
const mkdirp = require('mkdirp');
const config = require('./config');

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
console.log(config.logger.dir);
console.log(fileOrDirExists(config.logger.dir));
( !fileOrDirExists(config.logger.dir) && mkdir(config.logger.dir) ); // Create logger dir if not exists