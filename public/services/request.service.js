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
                    if(latency<data.latency){
                        latency = data.latency;
                        uri = data.uri;
                    }
                });

                if(uri.length>0){
                    console.log('resolve super node uri : '+uri);
                    SocUri  = uri;

                    try {
                        electron_remote.getGlobal('sharedObj').url = SocUri;
                    }catch (e) {
                        console.log('request service | request function | exception : '+e.message);
                    }
                }else {
                    console.log('zero super nodes')
                }


            }
        });
    },
        SocUriGlobal:function () {
            console.log('request service | Soc Uri Global Method | return: '+electron_remote.getGlobal('sharedObj').url);
            return electron_remote.getGlobal('sharedObj').url;
        }
    ,

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