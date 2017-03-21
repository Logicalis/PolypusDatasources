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
        var valid = adapterManager.validateDataSourceProperties(dummyAdapter,dataSourceProperties);
        expect(valid instanceof Array).toBeTruthy();

        dataSourceProperties.dummyProperty = 5;
        valid = adapterManager.validateDataSourceProperties(dummyAdapter,dataSourceProperties);
        expect(valid).toBeUndefined();

        dataSourceProperties.dummyProperty = "aasdasd";
        valid = adapterManager.validateDataSourceProperties(dummyAdapter,dataSourceProperties);
        expect(valid[0].message).toBe('should be number');
        
        var queryProperties = {};
        var validQuery = adapterManager.validateQueryProperties(dummyAdapter,queryProperties);
        expect(validQuery instanceof Array).toBeTruthy();

        queryProperties.message = "test";
        var validQuery = adapterManager.validateQueryProperties(dummyAdapter,queryProperties);
        expect(validQuery).toBeUndefined();

    });

});