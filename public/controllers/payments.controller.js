angular.module('orb').controller('PaymentController',function ($scope,SocketService,PaymentService,TempService) {
    let storage = require('node-persist');
    var jsonfy = require('jsonfy');
    var Interpreter = require('js-interpreter');
    var CodeFlask = require('codeflask');
    const swal = require('sweetalert');
    const swal2 = require('sweetalert2')
    const perf = require('execution-time')();

    $scope.coins = PaymentService.getcoins();
    // const flask = new CodeFlask('#code', { language: 'js' ,lineNumbers: true});

    var table = $('#table');

    storage.init({
        //initiate the persist object ( the function deployed as a object)
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

    }).then(()=>{
        // SocketService.setAnswer(storage);
        // $scope.rowData=null;
        storage.forEach(async function(datum) {
            // $scope.rowData.push(datum);
            table.append('<tr scope="row"><td>'+datum.key+'</td><td style="max-width: 300px">'+datum.value+'</td></tr>');
        });
    });

    // $scope.rowdata=SocketService.getAnswer()

    var check = $('#check');
    check.click(function() {
        console.log(storage.getItem('e857bf27-dbc4-eaaf-939b-d148ffea3b2e').then(function (data) {
            console.log(data)
            console.log(myInterpreter);
            console.time(x);
            function x(){
                eval("("+data+")");
            }
            console.timeEnd(x);
            swal("Execution Time : ")
        }));
    });

    $scope.sd="Sd";


    $scope.calculateExecutionTime=function (datum) {

        //validation
        if(datum ==null){
            swal("Error","No Parameters")
        }

        var threshold = 100;
        console.log(storage.getItem(datum).then(function (data) {
            console.log(data);
            //at beginning of your code
            perf.start();
            for(var i =1; i<threshold; i++){
                var myInterpreter = new Interpreter(data);
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
        }));
    }

    /**
     * This contains the logic in consuming functions
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


    $scope.showMessage=function () {
        swal({
            title: "Confirm Paying ?",
            text: "\"This function costs "+PaymentService.geteprice()+" per request based on complexity.",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    swal("You paid for the function !", {
                        icon: "success",
                    });
                }
            });
    }


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
     * Alert for Function Idle message
     * @type {*|jQuery|HTMLElement}
     */

    var checkCondition = $('#checkCondition');
    checkCondition.click(function() {
        swal( "Function is Idle !! ",{icon:"success"} );
    });


    /**
     * JSON box for parameter input
     * @type Angular $scope
     */

     var parameterObject = null;
     $scope.myVar=true;
     $scope.JSONpopupInput = async function () {

         const {value: text} = await swal2({
             input: 'textarea',
             inputPlaceholder: 'Type your message here...',
             showCancelButton: true
         })

         if (text) {
             swal2({
                 title: 'Confirm ?',
                 text: text,
                 type: 'warning',
                 showCancelButton: true,
                 confirmButtonColor: '#3085d6',
                 cancelButtonColor: '#d33',
                 confirmButtonText: 'Yes'
             }).then((result) => {
                 if (result.value) {
                     swal(
                         'Parameters Accepted!',
                         'Your Object has been accepted.',
                         'success'
                     )
                     parameterObject = eval('({' + text + '})');
                     console.log("PRAMS : ",parameterObject);
                     TempService.setParameterObject(parameterObject);
                     $scope.myVar=false;
                 }
             })
         }

     }


});