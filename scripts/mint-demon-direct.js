const { bytes, validation, BN, Long, units } = require('@zilliqa-js/util');
const {
    toBech32Address,
    getAddressFromPrivateKey,
  } = require('@zilliqa-js/crypto');
const { Zilliqa } = require('@zilliqa-js/zilliqa');


async function main() {
    const myArgs = process.argv.slice(2);

    if (myArgs.length < 5) {
        console.error("Wrong arguments\n");
        console.log("node mint-demon-direct.js [private_key] [0x_demon_addr] [0x_recipient_addr] [imageURI] [testnet / mainnet]");
        return;
    }

    let api = 'https://dev-api.zilliqa.com';
    const privateKey = myArgs[0];
    const demon = myArgs[1]         //0xbase16
    const recipient = myArgs[2];    // 0xbase16
    const imageURI = myArgs[3];     // demon image url from pinata
    const network = myArgs[4];

    if (network === 'mainnet') {
        api = 'https://api.zilliqa.com';
    }
    
    console.log("demon: ", demon);
    console.log("recipient: ", recipient);
    console.log("demon image: ", imageURI);
    console.log("network: ", api);

    const zilliqa = new Zilliqa(api);
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