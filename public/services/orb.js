var app = angular.module('orb');

app.service('SocketService', function() {

    let clientid = "Orbapp4343rsr324ssdwewe23424234234324dfdf";
    let url = ''
    let fnObj = []
    let sendFn = [] // peers and functions
    var IO = io('http://192.168.1.8:8000', { reconnect: true})
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
        getFunctionList : async function () {
            try{
                await IO.emit('flist', { socketId: IO.id}, function (data) {

                    if(data) {
                        console.log("Data"+JSON.stringify(data));
                        list=data;
                        return data;
                    }})
                console.log('No flist')
            }catch (e) {
                console.log('failed getting flist'+e.message)
            }
        },
        getAnswer : getAns,
        setAnswer : setAns,
        getFlist : getfList
    }

    var answer;
    var list;

    function setAns(ans){
        answer = ans;
    }

    function getAns() {
        return answer;
    }

    function getfList() {
        return list;
    }
});

app.controller('orbController', async function ($scope, SocketService) {
    $scope.answer="";
    $scope.func = {}
    let ans = null
    SocketService.getConnectIO().on('answer', async function(data){
        console.log(data)
        this.ans=data;
        await  SocketService.setAnswer(data);

        $scope.$watch($scope.func, async function () {
            $scope.ans = await SocketService.getAnswer();

        })
    })


    $scope.$watch(this.ans,function(newValue,oldValue){
        $scope.answer=this.ans;

        // your code goes here...
    });

        $scope.funcs= await SocketService.getFlist();


    $scope.funcs = [
        {name : "addAll", fn : "sample function"}
    ];
//function calling by id
    $scope.callFunction = async function (data) {

        try {
            if(data.name != null && data.params != null ){
                console.log(data.params)
                console.log(data.name)
                if(!Array.isArray(data.params)){
                    const formattedData = listToAray(data.params, ",")
                    if(formattedData === null) {
                        swal("Error in Calling Function - NULL parameters");
                        return
                    }
                    const paramsArr = formattedData.map(function (item) {
                        return parseInt(item, 10)
                    })

                    data.params=paramsArr;
                    //calling the socket service
                    // await SocketService.setAnswer(null);
                    await  SocketService.callFunction(data);

                    //$scope.answer = SocketService.getAnswer();
                } else {
                    SocketService.callFunction(data);
                }

            }
            else{
                swal("Error in Calling Function - NULL parameters");
            }
        }
        catch (e) {
            console.log("Exception in Calling Function - "+ e.message)
        }
    }


    function listToAray(fullString, separator) {
        var fullArray = [];

        if (fullString !== undefined) {
            if (fullString.indexOf(separator) == -1) {
                fullArray.push(fullString);
            } else {
                fullArray = fullString.split(separator);
            }
        }

        return fullArray;
    }

});