const request = require('request');
var electron_remote = require('electron').remote;// this module initiate pipe with electron app

var SocUri = "";

module.exports = {

    Request : function () {
        request('http://169.254.9.243:4500', function (error, response, body) {
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            // console.log('body:', body); // Print the HTML for the Google homepage.


            if(!error){
                obj = JSON.parse(body);
                var uri = "";
                var latency = 0;

                //need to implement resolving algo

                obj.forEach(data=>{
                    console.log(data);
                    if(latency<data.latency){
                        latency = data.latency;
                        console.log('url : '+data.uri);
                        uri = data.uri;
                    }
                });

                console.log('resolve super node uri : '+uri);
                SocUri  = uri;
                try {
                    electron_remote.getGlobal('sharedObj').url = SocUri;
                }catch (e) {

                }
            }
        });
    },
        SocUriGlobal:function () {
            console.log('request service | Soc Uri Global Method | return: '+electron_remote.getGlobal('sharedObj').url);
            // return electron_remote.getGlobal('sharedObj').url;
        }
    ,

    SocUri : function () {
        console.log('request service | Soc Uri Method | return: '+SocUri);
       return SocUri;
    }

};