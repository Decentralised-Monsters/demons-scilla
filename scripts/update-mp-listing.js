const { bytes, validation, BN, Long, units } = require('@zilliqa-js/util');
const {
    toBech32Address,
    getAddressFromPrivateKey,
  } = require('@zilliqa-js/crypto');
const { Zilliqa } = require('@zilliqa-js/zilliqa');

/**
 * Updates the marketplace address in the auction contract
 */
async function main() {
    const myArgs = process.argv.slice(2);

    if (myArgs.length < 3) {
        console.error("Wrong arguments\n");
        console.log("node update-mp-listing.js [private_key] [0x_auction_addr] [0x_marketplace_addr]");
        return;
    }

    const privateKey = myArgs[0];
    const auction = myArgs[1]           //0xbase16
    const marketplace = myArgs[2];      // 0xbase16

    console.log("auction: ", auction);
    console.log("updated marketplace: ", marketplace);

    const zilliqa = new Zilliqa('https://dev-api.zilliqa.com');
    zilliqa.wallet.addByPrivateKey(privateKey);
    const myGasPrice = units.toQa('2000', units.Units.Li);

    try {
        const networkId = await zilliqa.network.GetNetworkId();
        console.log("networkid: %o", networkId.result);

        const VERSION = bytes.pack(parseInt(networkId.result), 1);

        const contract = zilliqa.contracts.at(auction);
        const callTx = await contract.call(
            'UpdateDirectListing',
            [
                {
                    vname: "new_marketplace",
                    type: "ByStr20",
                    value: `${marketplace}`,
                }
            ],
            {
                version: VERSION,
                amount: new BN(0),
                gasPrice: myGasPrice,
                gasLimit: Long.fromNumber(10000),
            },
            33,
            1000,
            false
        );
        console.log(JSON.stringify(callTx, null, 4));
    } catch (err) {
        console.error(err);
    }
}

main();