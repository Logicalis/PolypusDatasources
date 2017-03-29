const unflatten = require('flat').unflatten;
const YAML      = require('yamljs');
const path      = require('path');

const ETC_PATH = '/etc/polypus/polypus.yml';
const LOCAL_PATH = 'config/polypus.yml';

const flatConfigObj = YAML.load(process.env.NODE_ENV == 'production' ? ETC_PATH : path.resolve(LOCAL_PATH));

const configObject = unflatten(flatConfigObj);

module.exports = configObject;