angular.module('orb').controller('EditorController',function ($scope,SocketService,PaymentService,PersistanceService,Web3Service) {
    //import Js file
    //  require('../js/editor')
    var CodeFlask = require('codeflask');
    const storage = require('node-persist');
    const swal = require('sweetalert');
    var JavaScriptObfuscator = require('javascript-obfuscator');
    var Interpreter = require('js-interpreter');
    var evaljs = require("evaljs");
    const perf = require('execution-time')();

    var pbar1 = $('#progressBX');
    // var pbar2 = $('#progressAA');
    pbar1.hide();
    // pbar2.hide();

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

            pbar1.show();

            var fid = guid(); //generate UUID for the function.
            postFunc.id = fid;

            var data = {id :postFunc.id, name: postFunc.name, fnc: flask.getCode().toString()}

            /**
             * charge for Deployment and host
             */

            var isPaid = false;

            // Promise
            var readyForDeployment = new Promise(
                function (resolve, reject) {
                    if (isPaid) {
                        var reason = new Error('You have already paid for this');
                        reject(reason); // reject
                    } else {
                        resolve(PayForDeploy()); // fulfilled
                    }

                }
            );

            readyForDeployment.then(function () {

                SocketService.postFunction(data);



            })

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
    function PayForDeploy(){
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
                return true;
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

        /**
         * Dfaas accounts
         */
        var dfaas2 = "0xB03F3583398e9DF1799C65Bd095dD666Bba17Dc4";

        Web3Service.sendCoins(dfaas2,X).then(function (hash) {
            console.log("$$$$PAID$$$$",hash);

            /**
             * Adding Trans. amount hash
             */
            hash.value=X;
            pbar1.hide();
            //PersistanceService.initStorage("deployed");
            //PersistanceService.addData(hash.transactionHash,hash).then(console.log(toastr.success('Transaction Saved !! ', "")));
            toastr.success('Successfully Paid & Deployed to Orb!');

        });

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

    // $scope.mybal = 40;
    // testBalance();
    //
    // function testBalance() {
    //     Web3Service.init();
    //     $scope.mybal = Web3Service.getBalance();
    //     console.log('########## BALANCE ###############',Web3Service.getBalance());
    // }


});
