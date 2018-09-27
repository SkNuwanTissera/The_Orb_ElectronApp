var app = angular.module('orb');

app.service('PersistanceService', function() {
    const storage = require('node-persist');
    // const usedFns = storage.create({dir: 'Used', ttl: 3000});
    // const deployedFns = storage.create({dir: 'deployed', ttl: 3000});

    let functionList = [];

    async function initStorage(path){

        /**
         * Deafault Path
         */
        if(path==null){
            path = '/core/storage/_persist/'
        }
        return await storage.init({
            dir: process.cwd() +'/.node-persist/'+path,

            stringify: JSON.stringify,

            parse: JSON.parse,

            encoding: 'utf8',

            logging: false,  // can also be custom logging function

            ttl: false, // ttl* [NEW], can be true for 24h default or a number in MILLISECONDS

            expiredInterval: 2 * 60 * 1000, // every 2 minutes the process will clean-up the expired cache

            // in some cases, you (or some other service) might add non-valid storage files to your
            // storage dir, i.e. Google Drive, make this true if you'd like to ignore these files and not throw an error
            forgiveParseErrors: false

        })

    }
    /**
     * These methods provide Persistance
     * Key value store
     *
     * @param id
     * @param data
     * @returns {*}
     */

    async function addData(id,data) {
        return await storage.setItem(id,data);
    }

    async function getValues () {
        return storage.values();
    }

    async function getItem(itemID) {
        return storage.getItem(itemID);
    }

    async  function deployedList(id,storage_name){
        var table1 = $('#'+id);
        initStorage(storage_name).then(()=>{
            storage.forEach(async function(datum) {
                table1.append('<tr><td style="word-wrap: break-word;max-width: 150px;">'+datum.value.to+'</td><td style="word-wrap: break-word;max-width: 150px;">'+datum.value.value+'</td><td style="word-wrap: break-word;max-width: 150px;">'+datum.value.transactionHash+'</td></tr>');
            });
        });
    }

    async  function calledList(id,storage_name){
        var table2 = $('#'+id);
        $("#"+id+ " tr").remove();
        initStorage(storage_name).then(()=>{
            storage.forEach(async function(datum) {

                table2.append('<tr><td style="word-wrap: break-word;max-width: 150px;">'+datum.value.to+'</td><td style="word-wrap: break-word;max-width: 150px;">'+datum.value.value+'</td><td style="word-wrap: break-word;max-width: 150px;">'+datum.value.transactionHash+'</td></tr>');
                // table.append('<tr scope="row"><td>'+datum.value.to+'</td><td style="max-width: 300px">'+datum.value.value+'</td><td>'+datum.value.transactionHash+'</td></tr>');
            });
            storage
        });
    }

    /**
     * Provides these services
     */
    return {
        initStorage:initStorage,
        addData:addData,
        getValues:getValues,
        getItem:getItem,
        deployedList : deployedList,
        calledList : calledList
    }

});