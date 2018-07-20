angular.module('orb').controller('EditorController',function ($scope,SocketService) {
   //import Js file
   //  require('../js/editor')
    var CodeFlask = require('codeflask');
    const storage = require('node-persist');
    const swal = require('sweetalert');
    var JavaScriptObfuscator = require('javascript-obfuscator');
    var Interpreter = require('js-interpreter');
    var evaljs = require("evaljs");
    const perf = require('execution-time')();
    // const axios = require('axios');
    //
    // let url = "http://localhost:3000";

    storage.init({
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

    })

//code for editor

    const flask = new CodeFlask('#code', { language: 'js' ,lineNumbers: true});

    flask.onUpdate((code) => {
        console.log(code);
    });

    const code = flask.getCode();


// code for obfuscation

    var obfuscate = $('#obfuscate');
    obfuscate.click(function () {
        var obfuscationResult = JavaScriptObfuscator.obfuscate(
            flask.getCode(),
            {
                compact: false,
                controlFlowFlattening: true
            }
        );

        toastr.success('Obfuscated!', "");
        console.log("Obfuscated Code : " + obfuscationResult.getObfuscatedCode());
        toastr.success('View the obfuscated code !! ', "")

        toastr.options.onclick = function() {
            swal("Obfuscated Code!", obfuscationResult.getObfuscatedCode());
        }

    });

//code for function calling

    var send = $('#send');
    send.click(function() {
        alert( "Handler for .click() called." );
        get();
    });


//code for json preparation and insert to db
    var save = $('#save');
    save.click(function() {
        addData(guid(),flask.getCode()).then(console.log(toastr.success('Saved !! ', "")));
    });

    function addData(id,data) {
        return storage.setItem(id,data);
    }

    function getValues () {
        return storage.values();
    }

    function getItem() {
        return storage.getItem('39c05122-476a-27d9-1cba-65dd76b9cc41');
    }

// code for interpreter
    var run = $('#runcode');
    run.click(function() {
        var func = flask.getCode();

        var res = evaljs.evaluate(func)
        toastr.success('Code is Running !! ', "");

        //at beginning of your code
        perf.start();
        var myInterpreter = new Interpreter(func);
        //at end of your code
        const results = perf.stop();
        console.log("execution time "+ results.time +" ms");  // in milliseconds

        myInterpreter.run();
        console.log("Interpreter :" +myInterpreter.value);
        console.log("Evaljs :" +res.toString());

        toastr.success('Executed! Answer is :  '+myInterpreter.value.toString() ,  );
        toastr.success('Execution Time : ' + results.time ,  );
    });

//generate UUID
    function guid() {
        function _p8(s) {
            var p = (Math.random().toString(16)+"000000000").substr(2,8);
            return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
        }
        return _p8() + _p8(true) + _p8(true) + _p8();
    }



    //deploy code
    $scope.postFunction = function (postFunc){
        //do some validation here
        if(postFunc.id == null || postFunc.name == null || flask.getCode() == null ){
            swal("Error","Null parameters");
        }
        var data = {id :postFunc.id, name: postFunc.name, fnc: flask.getCode().toString()}
        SocketService.postFunction(data);
        swal("Sucessfull","Deployed to Orb!")

    }

    // getFunctions();
    // async function getFunctions(){
    //
    //         var list = await SocketService.getConnectIO().getFunctionList()
    //         console.log("list "+list);
    // }
//parse JSON files
    let x = (
        function fibonacci(n, output) {
            var a = 1, b = 1, sum;
            for (var i = 0; i < n; i++) {
                output.push(a);
                sum = a + b;
                a = b;
                b = sum;
            }});

    var str = x.toString();

    function parseJSON(str) {
        try
        {
            var obj = JSON.parse(str);// this is how you parse a string into JSON
            console.log("data"+obj.fdata);
        } catch (ex) {
            console.error(ex);
        }
    }


});
