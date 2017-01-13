'use strict';

var configurationMap = {};
var statusMap = {};

var AdapterManager = require('lib/adapterManager');

function configureDataSource(ds) {
    // remove any configurations before, if the datasource was updated and need to be reconfigured
    delete configurationMap[ds._id];
    var adapter = AdapterManager.getAdapter(ds.adapter);
    adapter.configure(ds).then((configuration)=>{
        configurationMap[ds._id] = configuration;
    });
}

module.exports = {
    configureDataSource: configureDataSource,
    getStatus: getStatus
}