
const storage = require('node-persist');
var register = $('#register');
register.click(function() {
    var email = "nuwan25r"
    var password = "admin";
    var date = new Date().toString();

    var  Key= email+''+password+''+date;

    // Encode the String
    var encodedString = btoa(Key);

    console.log(Key);

    storage.init({
        dir: process.cwd() +'/core/storage/user',

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
        storage.setItem("user",encodedString).then(function () {
            window.location.href = 'editor.html';
        });
    });


    console.log(encodedString);

// Decode the String
    var decodedString = atob(encodedString);
    console.log(decodedString);
})
