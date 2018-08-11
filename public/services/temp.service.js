var app = angular.module('orb');

app.service('TempService', function() {
    var flist;
    return {
        setFunctions:setFuncs,
        getFunctions:getFuncs
    };
    
    function setFuncs(data) {
        flist=data;
    }
    
    function getFuncs() {
        return flist;
    }
})
