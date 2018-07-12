var app = angular.module('orb');

app.service('SocketService', function() {

    let clientid = "Orbapp4343rsr324ssdwewe23424234234324dfdf";
    let url = ''
    let fnObj = []
    let sendFn = [] // peers and functions
    var IO = io('http://localhost:3000', { reconnect: true})
    const _ = require('lodash')
    let funArr = []
    let superNodeArr = []


    IO.once('connect', function(){

        console.log('Connected' );

        IO.on('register', function (data) {
            IO.emit('reg-req', { clientid: clientid })
            console.log('Registered' );
        });

        IO.on('event', function(data){
            console.log(data)
        });

        IO.on('new-fun', function (data) {
            let sentObj = {
                destinationSocketId: data.destinationSocketId,
                destinationClientId: data.destinationClientId,
                id: data.id,
                name: data.name,
                fn: data.fn
            }

            let fnsList = _.unionBy([sentObj], funArr, 'id')
            funArr = fnsList
            console.log('Function added to function list' );
        })

        IO.on('answer-seek', function (data, callback) {
            console.log('============ Answering machine ============')
            const params = data.params
            const fnObj = data.fnobj
            // console.log("Function array "+funArr);
            for(let fn of funArr) {
                if(fn.name == fnObj.name) {
                    let actualfn = fn.fn
                    let res = eval("("+actualfn+")")
                    let ans = res(params)
                    callback(ans)
                }
            }
            console.log('============ Answering machine ended============')

        })

        IO.on('fnlist', function (data) {
            console.log(data)
        })

        IO.on('disconnect', function(){
            console.log('Disconneted')
        });

        IO.on('answer', function (data) {
            console.log("Answer : "+data)
        })

        IO.on('heartbeat', function (data) {
            console.log(data)
        })
    });

    return{
        getConnectIO : function () {
            return IO;
        },
        getIORegister : function(clientid) {
            IO.on('register',function (data){
                console.log(data)
                IO.emit('reg-req', { clientid: clientid })
                })
        },
        callFunction : function (data) {

            try{
                // var params = [1,32323];
                // var name = "addAll";
                // var arr = {clientId: clientid ,fname: name, params: params, socketId: IO.id}
                var params = data.params;
                var name = data.name;
                var arr = {clientId: clientid ,fname: name, params: params, socketId: IO.id}
                console.log(arr);
                IO.emit('fcall', arr);
                console.log("function Called- from orb app");
            }
            catch (e) {
                console.log("Error Occured : "+e.message)
            }
        },
        postFunction : function (data) {

            var function_id =  data.id;
            var function_name = data.name;
            var function_data = data.fnc;
                console.log("dsd"+function_data)
            try {
                const fnObj = {
                    clientId: clientid,
                    id: function_id,
                    name: function_name,
                    fn: function_data
                }

                IO.emit('deploy', fnObj)
                console.log('posted.....'+fnObj.fn+fnObj.name+fnObj.id)
            } catch (e) {
                console.log('failed in posting a function'+e.message)
            }
        },
        getFunctionList : function () {
            try{
                IO.emit('flist', { socketId: IO.id}, function (data) {

                    if(data) {
                        console.log("Data"+JSON.stringify(data));
                        return data;
                    }})
                console.log('No flist')
            }catch (e) {
                console.log('failed getting flist'+e.message)
            }
        }

    }});

app.controller('orbController', function ($scope, SocketService) {



//function calling by id



    $scope.callFunction = function (data) {
        var params = data.params;
        var paramsArr = params.split(',').map(function(item) {
            return parseInt(item, 10);
        });
        data.params=paramsArr;
        SocketService.callFunction(data);
    }

});