angular.module('orb').controller('AuthController',function ($scope,SocketService, TempService) {
    const storage = require('node-persist');
    $scope.loggedIn = false;

    storage.init({
        dir: process.cwd() +'/core/storage/registered',

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

    function addData(id,data) {
        console.log("call1")
        return storage.setItem(id,data);
    }

    $scope.registerUser = function (userData) {
        console.log("call2")
        addData(userData.email, userData.password);
    }

})