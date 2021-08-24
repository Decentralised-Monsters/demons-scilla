const { bytes, validation, BN, Long, units } = require('@zilliqa-js/util');
const {
    toBech32Address,
    getAddressFromPrivateKey,
  } = require('@zilliqa-js/crypto');
const { Zilliqa } = require('@zilliqa-js/zilliqa');


async function main() {
    const myArgs = process.argv.slice(2);

    if (myArgs.length < 4) {
        console.error("Wrong arguments\n");
        console.log("node mint-demon.js [private_key] [0x_demon_addr] [0x_recipient_addr] [imageURI]");
        return;
    }

    const privateKey = myArgs[0];
    const demon = myArgs[1]         //0xbase16
    const recipient = myArgs[2];    // 0xbase16
    const imageURI = myArgs[3];     // demon image url from pinata
    
    console.log("demon: ", demon);
    console.log("recipient: ", recipient);
    console.log("demon image: ", imageURI);

    const zilliqa = new Zilliqa('https://dev-api.zilliqa.com');
    zilliqa.wallet.addByPrivateKey(privateKey);
    const myGasPrice = units.toQa('2000', units.Units.Li);

    try {
        const networkId = await zilliqa.network.GetNetworkId();
        console.log("networkid: %o", networkId.result);

        const VERSION = bytes.pack(parseInt(networkId.result), 1);

        const contract = zilliqa.contracts.at(demon);
        const callTx = await contract.call(
            'Mint',
            [
                {
                    vname: "to",
                    type: "ByStr20",
                    value: `${recipient}`,
                },
                {
                    vname: "token_uri",
                    type: "String",
                    value: `${imageURI}`,
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