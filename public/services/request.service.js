const request = require('request');
var electron_remote = require('electron').remote;// this module initiate pipe with electron app

var SocUri = "";

module.exports = {

    Request : function () {
        request('http://169.254.9.243:4500', function (error, response, body) {

            if(!error){
                obj = JSON.parse(body);
                var uri = "";
                var latency = 0;

                //need to implement resolving algo

                obj.forEach(data=>{
                    console.log("Online Supernodes : "+data.uri)
                    if(latency<data.latency){
                        latency = data.latency;
                        uri = data.uri;
                    }
                });

                if(uri.length>0){
                    console.log('resolve super node uri : '+uri);
                    SocUri  = uri.toString();
                }else {
                    console.log('zero super nodes')
                }


            }
        });
    },

    SocUri : function () {

        if(SocUri.length>0){
            console.log('request service | Soc Uri Method | return: '+SocUri);
        }else {
            console.log('zero super nodes')
        }
       return SocUri;

    },

    resetSocUri: function () {
        SocUri = "";
    }

};