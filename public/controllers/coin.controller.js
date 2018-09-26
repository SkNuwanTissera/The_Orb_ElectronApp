angular.module('orb').controller('CoinController',function ($scope,SocketService, PaymentService,PersistanceService,CoinService) {
    CoinService.createWallet();
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
})