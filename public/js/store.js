const storage = require('node-persist');
module.exports = {

    initiate : function () {
        return storage.init({
            dir: process.cwd() +'/core/storage/_persist',

            stringify: JSON.stringify,

            parse: JSON.parse,

            encoding: 'utf8',

            logging: false,  // can also be custom logging function

            ttl: false, // ttl* [NEW], can be true for 24h default or a number in MILLISECONDS

            expiredInterval: 2 * 60 * 1000, // every 2 minutes the process will clean-up the expired cache

            // in some cases, you (or some other service) might add non-valid storage files to your
            // storage dir, i.e. Google Drive, make this true if you'd like to ignore these files and not throw an error
            forgiveParseErrors: false

        });
    },

    insert: function (id,data) {
        return storage.setItem(id,data);
    },

    delete: function (id) {
        return storage.removeItem(id);
    },

    restore: function () {
        return storage.clear();
    },

    getValues: function () {
        return storage.values();
    },

    getKeys: function () {
        return storage.keys();
    }


}