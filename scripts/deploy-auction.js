const { bytes, validation, BN, Long, units } = require('@zilliqa-js/util');
const {
    toBech32Address,
    getAddressFromPrivateKey,
  } = require('@zilliqa-js/crypto');
const { Zilliqa } = require('@zilliqa-js/zilliqa');
const fs = require('fs');

async function main() {
    const myArgs = process.argv.slice(2);

    if (myArgs.length < 6) {
        console.error("Wrong arguments\n");
        console.log("node deploy-auction.js [private_key] [0x_comm_wallet] [0x_dmz_addr] [0x_demon_addr] [0x_marketplace_addr] [testnet / mainnet]");
        return;
    }

    let api = 'https://dev-api.zilliqa.com';
    const privateKey = myArgs[0];
    const commWallet = myArgs[1];
    const dmz = myArgs[2];
    const demon = myArgs[3];
    const marketplace = myArgs[4];
    const network = myArgs[5];

    if (network === 'mainnet') {
        api = 'https://api.zilliqa.com';
    }

    console.log("comm wallet: ", commWallet);
    console.log("dmz: ", dmz);
    console.log("demon: ", demon);
    console.log("marketplace: ", marketplace);
    console.log("network: ", api);

    const zilliqa = new Zilliqa(api);
    zilliqa.wallet.addByPrivateKey(privateKey);
    const address = getAddressFromPrivateKey(privateKey);
    const myGasPrice = units.toQa('2000', units.Units.Li);

    try {
        const networkId = await zilliqa.network.GetNetworkId();
        console.log("networkid: %o", networkId.result);

        const VERSION = bytes.pack(parseInt(networkId.result), 1);

        // deploy impl
        const implCode = fs.readFileSync(__dirname + '/../auction/auction.scilla', 'utf-8');
        const init = [
            {
                vname: '_scilla_version',
                type: 'Uint32',
                value: '0',
            },
            {
                vname: 'contract_owner',
                type: 'ByStr20',
                value: `${address}`,
            },
            {
                vname: 'init_wallet',
                type: 'ByStr20',
                value: `${commWallet}`,
            },
            {
                vname: 'init_dmz',
                type: 'ByStr20',
                value: `${dmz}`,
            },
            {
                vname: 'main',
                type: 'ByStr20',
                value: `${demon}`,
            },
            {
                vname: 'init_marketplace',
                type: 'ByStr20',
                value: `${marketplace}`,
            },
        ];
        const implContract = zilliqa.contracts.new(implCode, init);
        const [deployedTx, implState] = await implContract.deploy(
            {
                version: VERSION,
                gasPrice: myGasPrice,
                gasLimit: Long.fromNumber(40000),
            },
            33,
            1000,
            false,
        );
        console.log(JSON.stringify(deployedTx, null, 4))
        console.log("contract address: %o", implState.address);
    } catch (err) {
        console.error(err);
    }
}

main();