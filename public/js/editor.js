var CodeFlask = require('codeflask');
const storage = require('node-persist');
const swal = require('sweetalert');
var JavaScriptObfuscator = require('javascript-obfuscator');


//code for editor

const flask = new CodeFlask('#code', { language: 'js' ,lineNumbers: true});

flask.onUpdate((code) => {
    console.log("Hiiii");
    console.log("This is "+code);
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


function get(){
    $.ajax({
        type:"GET",
        cache:false,
        url: 'http://dfaas.herokuapp.com/peers',
        dataType:'json',
        statusCode: {
            404: function() {
                alert( "page not found" );
            }
        },
        success:callback
    }).done(function(data) {
        console.log('--/>');
    });

    function callback(data) {
        console.log(data);
    }
}

//code for json preparation and insert to db
var save = $('#save');
save.click(function() {
    storage.init();
    addData('34234234',flask.getCode()).then(console.log(getValues()));
    toastr.success('Saved !! ', "")

});

//init storage
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

});

function addData(id,data) {
    return storage.setItem(id,data);
}

function getValues () {
    return storage.values();
}
