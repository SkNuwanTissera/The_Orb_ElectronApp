angular.module('orb').controller('orbController', async function ($scope, SocketService, TempService) {

    let list = null;
    $scope.answer="";
    $scope.func = {}
    let ans = null
    soc = SocketService.getConnectIO();
    soc.on('answer', async function(data){
        console.log(data)
        this.ans=data;
        await  SocketService.setAnswer(data);

        $scope.$watch($scope.func, async function () {
            $scope.ans = await SocketService.getAnswer();
        })
    })

    $scope.$watch(this.ans,function(newValue,oldValue){
        $scope.answer=this.ans;
    });

    $scope.populate= function () {
        soc.emit('flist', { socketId: soc.id}, function (data) {
            if(data) {
                console.log({'type':'flist','data':data});
                data = data.map(data => data.name)
                    .filter((value, index, self) => self.indexOf(value) === index);
                console.log(data)
                $scope.funcs = data
            }
            else{
                console.log("ERROR IN FUNCTION LOADING")
            }
        });
    };

   setTimeout(function () {
       soc.emit('flist', { socketId: soc.id}, function (data) {
           if(data) {
               console.log({'type':'flist','data':data});
               data = data.map(data => data.name)
                   .filter((value, index, self) => self.indexOf(value) === index)
               $scope.funcs = data
           }
           else{
               console.log("ERROR IN FUNCTION LOADING")
           }
       });
   },2000);

   setTimeout(function () {
       console.log($scope.funcs);

       $scope.funcs.forEach(function (data) {
           console.log(data.name);
       })

   },2500);

    console.log('Functions'+ await SocketService.getFlist());

    // $scope.funcs = await TempService.getFunctions();
    // console.log('Functions'+ await TempService.getFunctions());

    // $scope.funcs = [
    //     {name : "addAll", ds : "sample function"},
    //     {name : "sentiment", ds : "sample function"},
    // ];

//function calling by id
    $scope.callFunction = async function (data) {

        try {
            if(data.name != null && data.params != null ){
                console.log(data.params)
                console.log(data.name)
                if(!Array.isArray(data.params)){
                    const formattedData = listToAray(data.params, ",")
                    if(formattedData === null) {
                        swal("Error in Calling Function - NULL parameters");
                        return
                    }
                    const paramsArr = formattedData.map(function (item) {
                        return parseInt(item, 10)
                    })

                    data.params=paramsArr;
                    //calling the socket service
                    // await SocketService.setAnswer(null);
                    await  SocketService.callFunction(data);

                    //$scope.answer = SocketService.getAnswer();
                } else {
                    SocketService.callFunction(data);
                }
            }
            else{
                swal("Error in Calling Function - NULL parameters");
            }
        }
        catch (e) {
            console.log("Exception in Calling Function - "+ e.message)
        }
    }


    function listToAray(fullString, separator) {
        var fullArray = [];

        if (fullString !== undefined) {
            if (fullString.indexOf(separator) == -1) {
                fullArray.push(fullString);
            } else {
                fullArray = fullString.split(separator);
            }
        }

        return fullArray;
    }


});


// Initialize the editor with a JSON schema
var editor = new JSONEditor(document.getElementById('editor_holder'),{
    schema: {
        type: "object",
        title: "Car",
        properties: {
            make: {
                type: "string",
                enum: [
                    "Toyota",
                    "BMW",
                    "Honda",
                    "Ford",
                    "Chevy",
                    "VW"
                ]
            },
            model: {
                type: "string"
            },
            year: {
                type: "integer",
                enum: [
                    1995,1996,1997,1998,1999,
                    2000,2001,2002,2003,2004,
                    2005,2006,2007,2008,2009,
                    2010,2011,2012,2013,2014
                ],
                default: 2008
            },
            safety: {
                type: "integer",
                format: "rating",
                maximum: "5",
                exclusiveMaximum: false,
                readonly: false
            }
        }
    }
});

// Hook up the submit button to log to the console
document.getElementById('submit').addEventListener('click',function() {
    // Get the value from the editor
    console.log(editor.getValue());
});