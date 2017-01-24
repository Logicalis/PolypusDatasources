var path = require('path');

const adapterManager = require('../lib/adapterManager');

describe('Adapter Manager',()=>{

    it('should load adapters',()=>{
        var count = adapterManager.loadAdapters();
        expect(count).toBeGreaterThanOrEqual(1);

        var adapters = adapterManager.getAdapters();
        expect(Object.keys(adapters).length).toBeGreaterThanOrEqual(1);
    });

    it('should get adapters',()=>{
        var adapter = adapterManager.getAdapter('dummyAdapter');
        expect(adapter).toBeDefined();
    });

    it('should validate properties',()=>{
        var dummyAdapter = adapterManager.getAdapter('dummyAdapter');
        
        var dataSourceProperties = {};
        expect(adapterManager.validateDataSourceProperties(dummyAdapter,dataSourceProperties) instanceof Error).toBeTruthy();

        dataSourceProperties.dummyProperty = 5;
        expect(adapterManager.validateDataSourceProperties(dummyAdapter,dataSourceProperties)).toBeUndefined();
        
        var queryProperties = {};
        expect(adapterManager.validateQueryProperties(dummyAdapter,queryProperties) instanceof Error).toBeTruthy();

        queryProperties.message = "test";
        expect(adapterManager.validateQueryProperties(dummyAdapter,queryProperties)).toBeUndefined();

    });

});