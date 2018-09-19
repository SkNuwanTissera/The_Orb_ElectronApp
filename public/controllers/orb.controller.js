angular.module('orb').controller('orbController', async function ($scope, SocketService) {

    let list = null;
    $scope.answer="";
    $scope.func = {};
    let ans = null;

    /**
     * Importing Context from Socket Connection
     *
     */
    soc = SocketService.getConnectIO();

    /**
     * Seeking for Answer from Socket
     * Async func
     */

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

    /**
     * Emitting the function list
     *
     */
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


    /**
     * function calling with parameters
     * @param data
     * @returns {Promise<void>}
     *
     * TO-DO :
     * 1. Accept JSON as a parameter
     * 2. Accept string parameters
     *
     */
    $scope.callFunction = async function (data) {

        try {
            if(data.name != null && data.params != null ){

                console.log(data.params)
                console.log(data.name)

                /**
                 *  Condition 1 : if parameters are NOT as a array
                 *
                 */
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
                    //await SocketService.setAnswer(null);
                    await  SocketService.callFunction(data);

                } else {
                    /**
                     *  Condition 2 : if parameters are in form of an Array
                     *
                     */

                    console.log("DATA : ",data);
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
