
// const app = require('../app');

var path = require('path');
global.appRoot = path.resolve(__dirname+"/..");
const adapterManager = require('./adapterManager');

describe('Adapter Manager',()=>{

    it('should load adapters',()=>{
        var count = adapterManager.loadAdapters();
        expect(count).toBeGreaterThanOrEqual(1);
    });

});