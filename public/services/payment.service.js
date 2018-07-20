var app = angular.module('orb');
app.service('PaymentService', function ($http) {

    var coins = 50;
    var initial_coins= 50;

    var etime = 0;
    var eprice = 0;

    return {
        getcoins: getCoins,
        setcoins: setCoins,

        getetime: getEtime,
        setetime: setEtime,

        geteprice: getPrice,
        seteprice: setPrice
    };

    function getCoins() {
        return coins;
    }

    function setCoins(value) {
        coins = value;
    }

    function getEtime() {
        return etime;
    }

    function setEtime(time) {
        etime=time;
    }

    function getPrice() {
        return eprice;
    }

    function setPrice(price) {
        eprice=price;
    }
});