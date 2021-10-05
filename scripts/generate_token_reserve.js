const fs = require('fs');

/**
 * generate the token reserve json list for the crowd sale
 */
function main() {
    const myArgs = process.argv.slice(2);

    if (myArgs.length < 3) {
        console.error("Wrong arguments\n");
        console.log("node generate_token_reserve.js [start_number] [end_number] [pinata_uri]");
        console.log("\nexample:\nnode generate_token_reserve.js 1 666 https://gateway.pinata.cloud/ipfs/hash");
        return;
    }

    const startIndex = Number(myArgs[0]) - 1; // minus 1 for the for-loop
    const endIndex = Number(myArgs[1]);
    const pinata = myArgs[2];

    const tokens = [];
    
    for (let i = endIndex; i > startIndex; i--) {
        let imgNumStr = '';

        if (i < 10) {
            imgNumStr = `0${i}`;
        } else {
            imgNumStr = `${i}`;
        }

        const imgURI = `${pinata}/${imgNumStr}.jpg`;
        tokens.push(imgURI);
    }

    const json = JSON.stringify(tokens, null, 4);

    fs.writeFile('token_reserve.json', json, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        } else {
            return console.log("token_reserve.json generated!");
        }
    });
}

main()