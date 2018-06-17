var CodeFlask = require('codeflask');

var JavaScriptObfuscator = require('javascript-obfuscator');

// code for obfusfaction

var obfuscationResult = JavaScriptObfuscator.obfuscate(
    `
        (function(){
            var variable1 = '5' - 3;
            var variable2 = '5' + 3;
            var variable3 = '5' + - '2';
            var variable4 = ['10','10','10','10','10'].map(parseInt);
            var variable5 = 'foo ' + 1 + 1;
            console.log(variable1);
            console.log(variable2);
            console.log(variable3);
            console.log(variable4);
            console.log(variable5);
        })();
    `,
    {
        compact: false,
        controlFlowFlattening: true
    }
);

console.log(obfuscationResult.getObfuscatedCode());


//code for editor

const flask = new CodeFlask('#code', { language: 'js' ,lineNumbers: true});

flask.onUpdate((code) => {
    console.log("Hiiii");
    console.log("This is "+code);
});

const code = flask.getCode();


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