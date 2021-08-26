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
        console.log("node batch-mint-demon.js [private_key] [0x_demon_addr] [0x_recipient_addr] [number_of_demons]");
        return;
    }

    const privateKey = myArgs[0];
    const demon = myArgs[1];        // 0xbase16
    const recipient = myArgs[2];    // 0xbase16
    const numberToMint = myArgs[3];

    console.log("demon: ", demon);
    console.log("recipient: ", recipient);
    console.log("number of demons to mint: ", numberToMint);

    const zilliqa = new Zilliqa('https://dev-api.zilliqa.com');
    zilliqa.wallet.addByPrivateKey(privateKey);
    const myGasPrice = units.toQa('2000', units.Units.Li);

    try {
        const networkId = await zilliqa.network.GetNetworkId();
        console.log("networkid: %o", networkId.result);

        const VERSION = bytes.pack(parseInt(networkId.result), 1);

        const contract = zilliqa.contracts.at(demon);

        const tokenCount = await zilliqa.blockchain.getSmartContractSubState(demon, 'token_id_count');
        console.log("token count: ", tokenCount["result"]["token_id_count"]);
        let nextTokenCount = Number(tokenCount["result"]["token_id_count"]) + 1;

        let txList = [];
        // craft batch transactions
        for (let i = 0; i < numberToMint; i++) {
            let imgNumStr = nextTokenCount.toString();
            if (nextTokenCount < 10) {
                imgNumStr = `0${imgNumStr}`;
            }
            const imgURI = `https://demons.mypinata.cloud/ipfs/QmcNVSzac1chMmj3h1oaXfocKzER8RonmnMY6kviGKGYRw/${imgNumStr}.jpg`;
            
            const transitionParams = [
                {
                    vname: 'to',
                    type: 'ByStr20',
                    value: `${recipient}`,
                  },
                  {
                      vname: 'token_uri',
                      type: 'String',
                      value: `${imgURI}`,
                  },
            ]
    
            const data = {
                _tag: "Mint",
                params: [...transitionParams]
            }

            const tx = zilliqa.transactions.new(
                {
                    data: JSON.stringify(data),
                    version: VERSION,
                    toAddr: `${toBech32Address(demon)}`,
                    amount: new BN(0),
                    gasPrice: myGasPrice,
                    gasLimit: Long.fromNumber(10000),
                },
                false,
            );
            txList.push(tx);
            nextTokenCount = nextTokenCount + 1;
        }

        console.log("tx list: ", txList);

        const signedTxList = await zilliqa.wallet.signBatch(txList);

        const batchResult = await zilliqa.blockchain.createBatchTransactionWithoutConfirm(signedTxList,);

        console.log(JSON.stringify(batchResult, null, 4));
    } catch (err) {
        console.error(err);
    }

}

main()