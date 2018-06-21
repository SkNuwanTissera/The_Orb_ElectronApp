var CodeFlask = require('codeflask');
const storage = require('node-persist');
const swal = require('sweetalert');
var JavaScriptObfuscator = require('javascript-obfuscator');
var Interpreter = require('js-interpreter');


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
    // getItem().then(function(value) {
    //     console.log("DFG "+value);
    // })
    toastr.success('Code is Running !! ', "");
    var myInterpreter = new Interpreter(getItem().then(function (value) {
        return value;
    }));
    // var myInterpreter = new Interpreter(flask.getCode());
    myInterpreter.run();
    console.log("LOL :" +myInterpreter.value());
});

//generate UUID
function guid() {
    function _p8(s) {
        var p = (Math.random().toString(16)+"000000000").substr(2,8);
        return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
}



var baseurl = "http://localhost:3001/";
var userid = "3453ert";
var functionid ="eferetet";

//deploy code
let deploy = $('#deploy');
deploy.click(function() {
    //send POST request
    console.log("DFDFDF");


    const fn = (flask.getCode());

    const obj = {
        id:1243,
        name: "sentiment",
        fnc: JSON.stringify({fn:fn.toString()})
    }


    let url = baseurl;
    console.log('request to '+url);

    console.log(obj);
    $.ajax({
        type:"POST",
        cache:false,
        url: url,
        data:fn,
        dataType:"text",
        statusCode: {
            404: function() {
                alert( "page not found" );
            }
        },
        success:function (data) {
            console.log('function post request success')
            console.log(data)
        }
    }).done(function(data) {
        console.log("POST RETURN DATA"+data);
    });
});





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


var test = $('#test');
test.click(function() {
    parseJSON(str);
});

function parseJSON(str) {
    try
    {
        var obj = JSON.parse(str);// this is how you parse a string into JSON
        console.log("data"+obj.fdata);
    } catch (ex) {
        console.error(ex);
    }
}