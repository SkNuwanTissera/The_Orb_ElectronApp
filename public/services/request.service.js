const request = require('request');
var electron_remote = require('electron').remote;// this module initiate pipe with electron app

var SocUri = "";

const boostrapUri = "http://192.168.1.5:4500";

module.exports = {

    Request : function () {
        request(boostrapUri, function (error, response, body) {

            try {
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
            }catch (e) {
                console.log("Request Service | Request | Exception : "+e)
                console.log("check boostrap server Ip Address : trying to connect => "+boostrapUri)
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