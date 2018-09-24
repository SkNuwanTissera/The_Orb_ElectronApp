angular.module('orb').controller('EditorController',function ($scope,SocketService, PaymentService,PersistanceService) {
   //import Js file
   //  require('../js/editor')
    var CodeFlask = require('codeflask');
    const storage = require('node-persist');
    const swal = require('sweetalert');
    var JavaScriptObfuscator = require('javascript-obfuscator');
    var Interpreter = require('js-interpreter');
    var evaljs = require("evaljs");
    const perf = require('execution-time')();

//code for editor

    const flask = new CodeFlask('#code', { language: 'js' ,lineNumbers: true});

    flask.onUpdate(function (code) {
        $('#code textarea').val(code);
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

        if(obfuscationResult!=""){
            console.log("Obfuscated Code : " ,obfuscationResult.getObfuscatedCode());
            swal("Obfuscated Code!", obfuscationResult.getObfuscatedCode());
        }
        else{
            toastr.warning("Please write the function first",{msg:'warning'});
        }


    });

//code for function calling

    var send = $('#send');
    send.click(function() {
        alert( "Handler for .click() called." );
        get();
    });


    /**
     * code for json preparation and insert to db
     * @type {*|jQuery|HTMLElement}
     */

    var save = $('#save');
    var deploy = $('#deploy');

    save.click(function() {
        addData(guid(),flask.getCode()).then(console.log(toastr.success('Saved !! ', "")));
    });

    deploy.click(function() {
        addData(guid(),flask.getCode());
    });


    /**
     * Jquery
     * Purpose : Dry run the code to see for compile errors
     * Event : Inline code editor
     *
     * @type {*|jQuery|HTMLElement}
     */

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


    /**
     * This method can be used to generate UUID.
     *
     * @returns {*}
     */

    function guid() {
        function _p8(s) {
            var p = (Math.random().toString(16)+"000000000").substr(2,8);
            return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
        }
        return _p8() + _p8(true) + _p8(true) + _p8();
    }


    /**
     * Post a function to ORB network. User is charged here.
     *  TO-DO : Insert into table to track Deployed functions.
     * @function
     */
    $scope.postFunction = function (postFunc){

        if(postFunc != null && flask.getCode() != "" ){

        var fid = guid(); //generate UUID for the function.
        postFunc.id = fid;

        var data = {id :postFunc.id, name: postFunc.name, fnc: flask.getCode().toString()}

        SocketService.postFunction(data);
        toastr.success('Sucessfully Deployed to Orb!')
        }

        /**
         * Save the function in database
         * with additional meta-data | DATE | DESCRIPTION | USER_ID |
         */

        data.des = postFunc.desc;

        var datetime = new Date();
        data.timestap = datetime;

        data.clientID = SocketService.getClientID;

        PersistanceService.initStorage('functions');
        PersistanceService.addData(data.name,data).then(console.log(toastr.success('Function Saved !! ', "")));


    }

    /**
     * Pay when deploying.
     * Cost is based on Complexity.
     * User is charged in this.
     * @function
     */
    $scope.PayForDeploy=function () {
        var threshold = 100;
            perf.start();
            for(var i =1; i<threshold; i++){
                var myInterpreter = new Interpreter(flask.getCode());
            }
            //at end of your code
            const results = perf.stop();
            var etime = results.time/threshold
            PaymentService.setetime(etime);

            //calculate price
            console.log(calculatePrice(etime)+ " Coins");

            //showMessage(results.time);
            console.log("execution time "+ etime +" ms");  // in milliseconds
            swal({
                title: "Confirm Paying ?",
                text: "\"This function costs "+calculatePrice(etime)+" coins per request based on complexity.",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    PayForFunction(calculatePrice(etime));
                }
            });
    }



    /**
     * This contains the logic in deploying functions
     * @param time
     * @returns {number}
     */
    function calculatePrice(time){
        var total = 0;
        if(time < 2){
            total = 0.0001;
        }
        else if(time < 4){
            total = 0.0002;
        }
        else if(time < 6){
            total = 0.0004;
        }
        else if(time < 8){
            total = 0.0006;
        }
        else if(time < 12){
            total = 0.0008;
        }
        else if(time < 20){
            total = 0.001;
        }
        else if(time < 25){
            total = 0.0012;
        }
        else if(time < 35){
            total = 0.002;
        }
        else{
            total = 0.001
        }
        PaymentService.setetime(time);
        PaymentService.seteprice(total);
        return total;

    }

    /**
     *  Pay for function alert on DEPLOYMENT
     * @param X
     * @constructor
     */

    function PayForFunction(X) {


        var qw = PaymentService.getcoins()- X;
        if(PaymentService.getcoins()>0){
            PaymentService.setcoins(qw);
            $scope.coins=(Math.round(PaymentService.getcoins()*100)/100);
            swal("You paid for the function !", {
                icon: "success",
            });
        }
        else{
            swal("You need to recharge your wallet")
        }

    }

    /**
     *  JSON Parser
     *  parse JSON files
     * @type {fibonacci}
     */
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
