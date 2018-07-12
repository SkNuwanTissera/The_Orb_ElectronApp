angular.module('orb').controller('PaymentController',function ($scope,SocketService,PaymentService) {
    let storage = require('node-persist');
    var jsonfy = require('jsonfy');
    var Interpreter = require('js-interpreter');
    const swal = require('sweetalert');
    const perf = require('execution-time')();

    $scope.coins = PaymentService.getcoins();

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
            table.append('<tr scope="row"><td>'+datum.key+'</td><td style="max-width: 300px">'+datum.value+'</td><td><button id="check'+datum.key+'" class="btn btn-success rounded">Check</button></td><td><button id="pay"  class="btn btn-success rounded">Pay</button></td></tr>');
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
            console.log(data)
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
                    swal("You paid for the function !", {
                        icon: "success",
                    });

                }
            });
        }));
    }

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
        PaymentService.setcoins(qw);
        $scope.coins=(Math.round(PaymentService.getcoins()*100)/100);
    }





});