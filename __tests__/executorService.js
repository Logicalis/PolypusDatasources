

jest.mock('../lib/models/DataSource', ()=>{
    return {
        find: jest.fn((q,cb) => {
            var ds = {
                name: "testDS",
                adapter: "dummyAdapter",
                dataSourceProperties: {
                    dummyProperty: 10
                }
            };
            
            cb(null, [ds]);
            })
    }
});

var DataSource = require('../lib/models/DataSource');

var executor = require('../lib/executorService');

describe('Executor service',()=>{
    it('should ',() => {
        // expect(DataSource.find).toHaveBeenCalledTimes(1);
    });
    
});