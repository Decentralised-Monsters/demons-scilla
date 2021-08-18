const { bytes, validation, BN, Long, units } = require('@zilliqa-js/util');
const {
    toBech32Address,
    getAddressFromPrivateKey,
  } = require('@zilliqa-js/crypto');
const { Zilliqa } = require('@zilliqa-js/zilliqa');

// node transfer-dmz 0xrecipient dmz_amount
async function main() {
    const myArgs = process.argv.slice(2);

    if (myArgs.length < 4) {
        console.error("Wrong arguments\n");
        console.log("node transfer-dmz.js [private_key] [0x_dmz_contract_addr] [0x_recipient_addr] [dmz_amt_to_xfer]");
        return;
    }

    const privateKey = myArgs[0];
    const dmz = myArgs[1]           //0xbase16
    const recipient = myArgs[2];    // 0xbase16
    const dmzAmt = myArgs[3];       // in dmz places

    console.log("dmz: ", dmz);
    console.log("recipient: ", recipient);
    console.log("amount (dmz): ", dmzAmt);

    const zilliqa = new Zilliqa('https://dev-api.zilliqa.com');
    zilliqa.wallet.addByPrivateKey(privateKey);
    const myGasPrice = units.toQa('2000', units.Units.Li);

    try {
        const networkId = await zilliqa.network.GetNetworkId();
        console.log("networkid: %o", networkId.result);

        const VERSION = bytes.pack(parseInt(networkId.result), 1);

        const contract = zilliqa.contracts.at(dmz);
        const callTx = await contract.call(
            'Transfer',
            [
                {
                    vname: "to",
                    type: "ByStr20",
                    value: `${recipient}`,
                },
                {
                    vname: "amount",
                    type: "Uint128",
                    value: `${dmzAmt}`,
                },
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