var app = angular.module('orb');

app.service('TempService', function() {
    var flist;
    var fparams;
    return {
        setParameterObject : setParameterObject,
        getParameterObject : getParameterObject,
        setFunctions:setFuncs,
        getFunctions:getFuncs
    };
    
    function setFuncs(data) {
        flist=data;
    }
    
    function getFuncs() {
        return flist;
    }

    function setParameterObject(data) {
       fparams=data;
    }

    function getParameterObject() {
        return fparams;
    }

})
