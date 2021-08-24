const { bytes, validation, BN, Long, units } = require('@zilliqa-js/util');
const {
    toBech32Address,
    getAddressFromPrivateKey,
  } = require('@zilliqa-js/crypto');
const { Zilliqa } = require('@zilliqa-js/zilliqa');

/**
 * Updates the auction address in the marketplace contract
 */
async function main() {
    const myArgs = process.argv.slice(2);

    if (myArgs.length < 3) {
        console.error("Wrong arguments\n");
        console.log("node update-auction-listing.js [private_key] [0x_marketplace_addr] [0x_auction_addr]");
        return;
    }

    const privateKey = myArgs[0];
    const marketplace = myArgs[1];      // 0xbase16
    const auction = myArgs[2]           //0xbase16

    console.log("marketplace: ", marketplace);
    console.log("updated auction: ", auction);

    const zilliqa = new Zilliqa('https://dev-api.zilliqa.com');
    zilliqa.wallet.addByPrivateKey(privateKey);
    const myGasPrice = units.toQa('2000', units.Units.Li);

    try {
        const networkId = await zilliqa.network.GetNetworkId();
        console.log("networkid: %o", networkId.result);

        const VERSION = bytes.pack(parseInt(networkId.result), 1);

        const contract = zilliqa.contracts.at(marketplace);
        const callTx = await contract.call(
            'UpdateAuctionListing',
            [
                {
                    vname: "new_auction",
                    type: "ByStr20",
                    value: `${auction}`,
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