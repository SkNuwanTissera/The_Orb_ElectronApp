var app = angular.module('orb');

app.service('CoinService', function() {

    /**
     * Connected to Rinkeby
     * @type {EthereumWallet}
     */

    let myWallet = new EthereumWallet('https://rinkeby.infura.io/v3/532b4a8a9f4843afb1ac59e0ae3bb297')

    /**
     * If your wallet hasn't been created yet, it's needed to create it.
     * It's easy to check if your wallet has been created. Just check for the existence of a keystore.
     */

    async function createWallet() {
        if (await myWallet.hasKeystore) {
            // wallet exists
        } else {
            await myWallet.init();
            let seed = myWallet.generateSeed();
            let password = 'orb123' // choose one
            await myWallet.createKeystore(password, seed)
        }
    }

    async function unlockWallet() {
        await myWallet.unlock('orb123')
    }

    async function generateAddress() {
        let address = await myWallet.getNewAddress();
        return address;
    }

    async function getRemainingBalance() {
        let balance = await myWallet.balance;
        return balance;
    }

    /**
     * Blocks and Transactions
     * @returns {Promise<*>}
     */

    async function getCurrentBlock() {
        let blockCount = await myWallet.blockNumber;
        return blockCount;
    }

    async function getBlockwithHash(hblock_id_or_hashash) {
        let blockInfo = await myWallet.getBlock(block_id_or_hash);
        return blockInfo;
    }

    async function getTransactionDetails(trans_id) {
        let txInfo = await myWallet.getTransaction(trans_id);
        return txInfo;
    }

    /**
     * Gas
     * get the current gas price (median of the latest blocks)
     * @returns {Promise<void>}
     */
    async function getCurrentGasPrice() {
        let gasPrice = await myWallet.gasPrice;
        return gasPrice;
    }

    /**
     * estimate the gas needed for a transaction
     * @param trans_amount
     * @param target_wallet
     * @param optional
     * @returns {Promise<void>}
     */
    async function estimateTheGas(trans_amount, target_wallet, optional) {
        let gasLimit = await myWallet.estimateGas({
            value: trans_amount,
            to: target_wallet,
            gasPrice: await myWallet.gasPrice,
            nonce: myWallet.getNonce(fromWallet),
            data: optional || 'optional'
        })
    }

    /**
     * Send Coins to wallet
     * @param from
     * @param to
     * @param amount
     * @returns {Promise<void>}
     */
    async function sendCoins(from, to, amount) {
        let from_wallet = from || myWallet.address
        let to_wallet = to
        let coins = amount * 10e18 // in Wei (1*10^18 Wei = 1 Ether)

        try {
            let txid = await myWallet.sendToAddress(from_wallet, to_wallet, coins)
        } catch (e) {
            console.log("Could not send Coins. Reason: " + e.message)
        }
    }

    return {
        createWallet : createWallet,
        unlockWallet : unlockWallet,
        generateAddress : generateAddress,
        getRemainingBalance : getRemainingBalance,
        getCurrentBlock : getCurrentBlock,
        getBlockwithHash : getBlockwithHash,
        getTransactionDetails : getTransactionDetails,
        getCurrentGasPrice : getCurrentGasPrice,
        estimateTheGas : estimateTheGas,
        sendCoins : sendCoins
    }

})
