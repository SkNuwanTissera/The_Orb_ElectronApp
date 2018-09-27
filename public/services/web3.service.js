var app = angular.module('orb');

app.service('Web3Service',function() {


    var Web3 = require('web3');

    web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/532b4a8a9f4843afb1ac59e0ae3bb297"));

    web3.eth.accounts.privateKeyToAccount('0xE983E99088D39E7708D6C5B23D5DFBA023C61DCE00AB7AF0D4A1D4433475E1C9');

    var prevBal = "";

    /**
     * Send Coins to wallet
     * @param _toAddress
     * @param _value
     * @returns {Promise<void>}
     */

    async function sendCoins(_toAddress, _value) {

        var mainEthAccount = await web3.eth.accounts.privateKeyToAccount('0xE983E99088D39E7708D6C5B23D5DFBA023C61DCE00AB7AF0D4A1D4433475E1C9');
        await web3.eth.accounts.wallet.add(mainEthAccount);
        web3.eth.defaultAccount = mainEthAccount.address;

        _value = _value*1000;
        let amount = await web3.utils.toWei(_value.toString(), 'Wei');

        return await web3.eth.sendTransaction({
            from: mainEthAccount.address,
            to: _toAddress,
            value: amount,
            gas: 500000
        },function(error, hash){
            if (error) {
                return "##"
            } else {
                return hash;
            }
        })
    }

    /**
     * Get Balance from accont
     * @returns {Promise<*>}
     */

    async function getBalance() {
        var mainEthAccount = await web3.eth.accounts.privateKeyToAccount('0xE983E99088D39E7708D6C5B23D5DFBA023C61DCE00AB7AF0D4A1D4433475E1C9');
        await web3.eth.accounts.wallet.add(mainEthAccount);
        web3.eth.defaultAccount = mainEthAccount.address;
        return await web3.eth.getBalance(mainEthAccount.address,function (error, result) {
            if (error) {
                return "##"
            } else {
                // setPrevBal(result);
                return result;
            }
        })
    }

    function getPrevBal() {
        return prevBal;
    }

    function setPrevBal(bval) {
        prevBal = bval
    }

    return {
        getBalance : getBalance,
        sendCoins : sendCoins,
        getPrevBal : getPrevBal
    }


})