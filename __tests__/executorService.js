jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
global.Promise = require.requireActual('promise');

jest.mock('lib/models/DataSource', ()=>{ // mock can't refer to outside vars
    return {
        find: jest.fn((q,cb) => {
            var ds = {
                _id: "uniqueObjectID",
                name: "testDS",
                adapter: "dummyAdapter",
                dataSourceProperties: {
                    dummyProperty: 15
                }
            };

            cb(null, [ds]);
        })
    }
});

var DataSource = require('lib/models/DataSource');

var executor = require('../lib/executorService');

describe('Executor service',()=>{
    var ds = {
        _id: "uniqueObjectID",
        name: "testDS",
        adapter: "dummyAdapter",
        dataSourceProperties: {
            dummyProperty: 15
        }
    };

    it('should be initialized',() => {
        return executor.isLoadedPromise.then((statuses)=>{
            expect(Object.keys(statuses).length).toBe(1);
            expect(DataSource.find).toHaveBeenCalledTimes(1);
            expect(statuses[ds._id].ok).toBeTruthy();
        });
    });

    it('should get status with error from datasource',()=>{
        ds.dataSourceProperties.dummyProperty = 10; // error on configure
        return executor.configureDataSource(ds).catch((status) => {
            expect(status.ok).toBeFalsy();
            expect(status.error).toBeDefined();
            expect(executor.getStatus(ds._id)).toBe(status);
        });
    });

    it('should execute query properties on datasource',()=>{
        ds.dataSourceProperties.dummyProperty = 15;
        return executor.configureDataSource(ds).then((status) => {
            expect(status.ok).toBeTruthy();
            var queryProperties = {
                message: "MessageTest"
            };
            return executor.executeDataSource(ds, queryProperties).then((data) => {
                expect(data.message).toBe(queryProperties.message);
                expect(data.dummy).toBe(ds.dataSourceProperties.dummyProperty);
            });
        });
    });

    it('should execute query with params',()=>{
        var query = {
            name: "qtest",
            dataSource: ds,
            queryProperties:{
                message: "${123}, ${ abc }, ${  test }"
            }
        };
        var params = {
            123: 123,
            abc: "abc"
            // 'test' missing
        }
        return executor.executeQuery(query,params).then((data) => {
            expect(data.message).toBe("123, abc, ");
        });

    }); 
});