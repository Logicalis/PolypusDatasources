'use strict';

var fs = require('fs');
var path = require('path');
const logger = require('lib/logger')('datasourceapi-adapters');
const _ = require('lodash');

var adapters = {};

function loadAdapters() {
      adapters = {};
      logger.info('Loading Adapters...');
      var pathToLoad = path.join(appRoot, '/adapters');
      var files = fs.readdirSync(pathToLoad);
      for (var file of files) {
          var f = path.join(pathToLoad, file);
          var adapter = require(f);
          adapters[adapter.name] = adapter;
          logger.debug(`Loaded ${adapter.displayName} (${adapter.name}).`);
      }      
      let count = Object.keys(adapters).length;
      logger.info(count + ' adapters loaded.');
      return count;
}


loadAdapters();

module.exports = {
    adapters: adapters,
    loadAdapters: loadAdapters
}