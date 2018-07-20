
var app = angular.module('orb', ['ngRoute']);

// configure our routes
app.config(function($routeProvider) {
    $routeProvider

        .when('/deploy', {
            templateUrl : 'deployed.html',
            controller : 'EditorController'
        })


        .when('/editor', {
            templateUrl : 'editor.html'
        })

        .when('/function', {
            templateUrl : 'callFunction.html'
        })

        .when('/wdash', {
            templateUrl : 'wallet_dashboard.html'
        })

        .when('/wallet', {
            templateUrl : 'orbwallet.html'
        })

});