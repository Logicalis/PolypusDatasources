const unflatten = require('flat').unflatten;
const YAML      = require('yamljs');
const path      = require('path');

const ETC_PATH = '/etc/logicalis/datasourceapi/datasourceapi.yml';
const LOCAL_PATH = 'config/datasourceapi.yml';

const flatConfigObj = YAML.load(process.env.NODE_ENV == 'production' ? ETC_PATH : path.resolve(LOCAL_PATH));

const configObject = unflatten(flatConfigObj);

module.exports = configObject;