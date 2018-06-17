var CodeFlask = require('codeflask');

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

    console.log("Obfuscated Code : " + obfuscationResult.getObfuscatedCode());
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