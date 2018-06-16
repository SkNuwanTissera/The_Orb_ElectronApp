var CodeFlask = require('codeflask')

const flask = new CodeFlask('#code', { language: 'js' ,lineNumbers: true});

flask.onUpdate((code) => {
    console.log("Hiiii");
    console.log("This is "+code);
});

