let storage = require('node-persist');
var jsonfy = require('jsonfy');
var Interpreter = require('js-interpreter');
const swal = require('sweetalert');
const perf = require('execution-time')();


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
    storage.forEach(async function(datum) {
        table.append('<tr scope="row"><td>'+datum.key+'</td><td style="max-width: 300px">'+datum.value+'</td><td><button id="check'+datum.key+'" class="btn btn-success rounded">Check</button></td><td><button id="pay" class="btn btn-danger rounded">Deploy</button></td></tr>');
    });
});


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



var sd = $('#sd');
sd.click(function() {
    console.log(storage.getItem('e857bf27-dbc4-eaaf-939b-d148ffea3b2e').then(function (data) {
        console.log(data.key)
        //at beginning of your code
        perf.start();
        var myInterpreter = new Interpreter(data);
        //at end of your code
        const results = perf.stop();
        console.log("execution time "+ results.time +" ms");  // in milliseconds
    }));
        swal({
            title: "Confirm Paying ?",
            text: "\"This function costs 0.00001 per request based on complexity.",
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

});




