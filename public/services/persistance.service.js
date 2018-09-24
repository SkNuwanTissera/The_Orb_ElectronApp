var app = angular.module('orb');

app.service('PersistanceService', function() {
    const storage = require('node-persist');

    let functionList = [];

    async function initStorage(path){

        /**
         * Deafault Path
         */
        if(path==null){
            path = '/core/storage/_persist/'
        }
        await storage.init({
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
        //
        // await this.storage.forEach(async function(datum) {
        //     functionList.push(datum);
        // })
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

    // async function getAllFunctions() {
    //     this.storage.forEach(async function(datum) {
    //         this.functionList.push(datum);
    //     })
    // }



    /**
     * Provides these services
     */
    return {
        initStorage:initStorage,
        addData:addData,
        getValues:getValues,
        getItem:getItem,
        // getAllFunctions:getAllFunctions,
        getfunctionList:functionList
    }

});