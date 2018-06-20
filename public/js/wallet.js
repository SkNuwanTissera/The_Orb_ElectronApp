let storage = require('node-persist');
var jsonfy = require('jsonfy');
var Interpreter = require('js-interpreter');

var table = $('#table');

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

}).then(()=>{
    storage.forEach(async function(datum) {
        table.append('<tr scope="row"><td>'+datum.key+'</td><td>'+datum.value+'</td><td><button id="check" class="btn btn-success rounded">Check</button></td><td><button class="btn btn-success rounded">Pay</button></td></tr>');
    });
});


var check = $('#check');
check.click(function() {

    console.log(storage.getItem('d3a76c70-d828-064f-4c5c-a984d2f8a553').then(function (data) {
        console.log(data)
        var x= data;
        var myInterpreter = new Interpreter(x);
        console.log(myInterpreter);
        console.time(x);
        x();
        console.timeEnd(x);
    }));
});



