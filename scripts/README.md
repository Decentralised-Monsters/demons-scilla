# Scripts

This section contains the list of scripts to deploy the contracts, transfer dmz, mint demons etc. More would be added.

Execute `yarn install` before running the scripts.


## Deploy Auction
```bash
node deploy-auction.js [private_key] [0x_dmz_addr] [0x_demon_addr] [0x_marketplace_addr]
```

**Note**: Please deploy a dummy marketplace and use that marketplace address if the actual marketplace contract is not deployed.


## Deploy Dummy Marketplace
```bash
node deploy-dummy-mp.js [private_key]
```

## Deploy Marketplace
```bash
node deploy-mp.js [private_key] [0x_dmz_addr] [0x_demon_addr] [0x_auction_addr]
```

## Deploy LevelUp
```bash
node deploy-levelup.js [private_key] [0x_dmz_addr] [0x_demon_addr]
```

## Update Auction's Marketplace Address
To update the auction's marketplace contract address after the actual marketplace contract is deployed.

```bash
node update-mp-listing.js [private_key] [0x_auction_addr] [0x_marketplace_addr]
```

## Update Marketplace's Auction Address
To update the marketplace's auction contract address after the actual auction contract is deployed.

```bash
node update-auction-listing.js [private_key] [0x_marketplace_addr] [0x_auction_addr]
```

## Mint Demon
Used by minter / contract owner
```bash
node mint-demon.js [private_key] [0x_demon_addr] [0x_recipient_addr] [imageURI]
```

## Transfer DMZ
Used by contract owner
```bash
node transfer-dmz.js [private_key] [0x_dmz_contract_addr] [0x_recipient_addr] [dmz_amt_to_xfer]
```