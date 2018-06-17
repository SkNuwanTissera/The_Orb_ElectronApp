var CodeFlask = require('codeflask')

const flask = new CodeFlask('#code', { language: 'js' ,lineNumbers: true});

flask.onUpdate((code) => {
    console.log("Hiiii");
    console.log("This is "+code);
});

const code = flask.getCode();


var net = require('electron')('net');
var send = $('#send');
send.click(function() {
    alert( "Handler for .click() called." );
    get();
});


function get(){
    const request = net.request({
        method: 'GET',
        protocol: 'https:',
        hostname: 'github.com',
        port: 443,
        path: '/'
    });

    request.on('response', (response) => {
        console.log(`STATUS: ${response.statusCode}`);
        response.on('error', (error) => {
            console.log(`ERROR: ${JSON.stringify(error)}`)
        })
    });
}