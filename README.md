# Demons contracts.

Contracts:
  * [Main ZRC1](https://github.com/Decentralised-Monsters/demons-scilla/tree/master/ZRC1/nft-demons.scilla)
  * [Main DMZ ZRC2](https://github.com/Decentralised-Monsters/demons-scilla/tree/master/ZRC2/dmz.scilla)
  * [Claim DMZ (DeMons Self Generate Rewards)](https://github.com/Decentralised-Monsters/demons-scilla/tree/master/claim)
  * [Crowd Sale](https://github.com/Decentralised-Monsters/demons-scilla/tree/master/crowd-sale)
  * [Level Up](https://github.com/Decentralised-Monsters/demons-scilla/tree/master/lvl)
  * [Name Change](https://github.com/Decentralised-Monsters/demons-scilla/tree/master/name-change)
  * [Marketplace](https://github.com/Decentralised-Monsters/demons-scilla/tree/master/market-place)
  * [Auction](https://github.com/Decentralised-Monsters/demons-scilla/tree/master/auction)
  * [Voting](https://github.com/Decentralised-Monsters/demons-scilla/tree/master/vote)
  * [Liquidity](https://github.com/Decentralised-Monsters/demons-scilla/tree/master/distributor)
  * [Staking](https://github.com/Decentralised-Monsters/demons-scilla/tree/master/staking)
  * [Airdrop](https://github.com/Decentralised-Monsters/demons-scilla/tree/master/airdrop)
  * [Lockup](https://github.com/Decentralised-Monsters/demons-scilla/tree/master/lockup)
  * [Whitelist Proxy](https://github.com/Decentralised-Monsters/demons-scilla/tree/master/whitelist-proxy)

## Order of Deployment
**1. Deploy ZRC2 dmz contract.**

```
name: DMZ
symbol: DMZ
decimals: 18
init_supply: 166666000000000000000000000
```

\
**2. Deploy ZRC1 demons contract**

```
name: DEM
symbol: DEM
```

\
**3. Deploy claim distributor contract.**

```
blocks_for_rewards = 2160
rewards = 1902587519025926

1 day = 1902587519025926 * 2160 = 4109589041096000160 = 4.1 DMZ
```

Open [scripts](https://github.com/Decentralised-Monsters/demons-scilla/blob/master/scripts/deploy-claim.js) and execute:

```
node deploy-claim.js [private_key] [0x_comm_wallet] [0x_dmz_addr] [0x_demon_addr] [testnet / mainnet]
```

\
**4. Deploy crowd sale (line variant) contract.**

```
decimal = 25
price = 3000000000000000  // 3000 ZIL
buy_incentive = 200000000000000000000  // 200 DMZ
```

Open [scripts](https://github.com/Decentralised-Monsters/demons-scilla/blob/master/scripts/deploy-crowd-sale-v2.js) and execute:

```
node deploy-crowd-sale-v2.js [private_key] [0x_wallet_addr] [0x_dmz] [0x_demon_addr] [testnet / mainnet]
```

\
**5. Deploy lvl up contract**

```
max_lvl = 5
min_lvl_for_earn_reward = 2
fee_multiplier = 100
```

Open [scripts](https://github.com/Decentralised-Monsters/demons-scilla/blob/master/scripts/deploy-lvlup.js) and execute:

```
 node deploy-lvlup.js [private_key] [0x_wallet] [0x_dmz_addr] [0x_claim_distributor_addr] [0x_demon_addr] [testnet / mainnet]
```

\
**6. Deploy name change contract**

```
min_lvl_for_change = 5
price_for_change = 250000000000000000000 // 250 DMZ
```

Open [scripts](https://github.com/Decentralised-Monsters/demons-scilla/blob/master/scripts/deploy-name-change.js) and execute:

```
node deploy-name-change.js [private_key] [0x_comm_wallet] [0x_dmz_addr] [0x_demon_addr] [testnet / mainnet]
```

\
**7. Deploy dummy marketplace contract.**

\
**8. Deploy auction contract**

```
max_dmz = 16666660000000000000000000
commission = 5
min_increment = 5
min_auction_price = 1000000000000000000   // 1 DMZ
```

Open [scripts](https://github.com/Decentralised-Monsters/demons-scilla/blob/master/scripts/deploy-auction.js) and execute:

```
node deploy-auction.js [private_key] [0x_comm_wallet] [0x_dmz_addr] [0x_demon_addr] [0x_marketplace_addr] [testnet / mainnet]
```

\
**9. Deploy marketplace contract**
```
commission = 5
```

Open [scripts](https://github.com/Decentralised-Monsters/demons-scilla/blob/master/scripts/deploy-mp.js) and execute:

```
node deploy-mp.js [private_key] [0x_comm_wallet] [0x_dmz_addr] [0x_demon_addr] [0x_auction_addr] [testnet / mainnet]
```

\
**10. Update marketplace address from (9) in auctions contract**
```
UpdateDirectListing(marketplace)
```

Open [scripts](https://github.com/Decentralised-Monsters/demons-scilla/blob/master/scripts/update-mp-listing.js) and execute:

```
node update-mp-listing.js [private_key] [0x_auction_addr] [0x_marketplace_addr] [testnet / mainnet]
```

\
**11. On the claim distributor contract, set the lvl up contract**
```
SetLvlUp(lvlup_contract)
```

\
**12. On the demons contract, execute:**
```
ConfigureMinter(crowd_sale_contract)
ConfigureMinter(lvlup_contract)
ConfigureMinter(namechange_contract)
```

The above is to set the access for the crowd sale, lvlup and namechange contract as these contracts would need to change the demons' stats.

\
**13. On the dmz contract, swap to the `init_wallet` defined in crowd sale contract, execute:**
```
IncreaseAllowance(crowd_sale_contract, 20000000000000000000000) // 200 DMZ * 100
```

This is to allow the crowd sale contract to distribute the buy incentive (DMZ) from wallet.

\
**14. On the dmz contract, swap to the `init_wallet` defined in claim distributor contract, execute:**
```
IncreaseAllowance(claim_distributor_contract, 150000000000000000000000) // 1500 DMZ * 100
```

**Note**: the `init_wallet` in this step might be different from (13). Please check before executing.

\
**15. Transfer 200 DMZ * 100 to crowd sale wallet**

\
**16. Transfer 1500 DMZ * 100 to claim distributor wallet**

\
**17. Prepare the token_reserve.json file**

Open [scripts](https://github.com/Decentralised-Monsters/demons-scilla/blob/master/scripts/generate_token_reserve.js) and execute:

```
node generate_token_reserve.js [start_number] [end_number] [pinata_uri] [img_format]

example
node generate_token_reserve.js 1 666 https://gateway.pinata.cloud/ipfs/hash jpg
```

\
**18. On the crowd sale contract, execute:**
```
AddReserveList()
```

Use the `token_reserve.json` data as the parameters.

**Note**: Perform this step 5 mins before the sales start. Ensure that the list of demons URI is in reverse order, i.e. the images number should be in descending order, image_300.jpg, image_299.jpg and so on.

\
**19. On the crowd sale contract, execute:**
```
UpdatePause()
```

**Note**: Perform this step only at exact time to unpause the contract so that people can start to buy.


## Ownership Transfer
If ownership is transferred, the following have to be updated:
1. Demons contract, call `ConfigureMinter` to remove previous owner and add new owner as minter.
