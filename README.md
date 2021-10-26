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

## Order of Deployment
1. Deploy ZRC2 dmz contract.

```
name: DMZ
symbol: DMZ
decimals: 18
init_supply: 166666000000000000000000000
```

1. Deploy ZRC1 demons contract.

```
name: DEM
symbol: DEM
```

1. Deploy claim distributor contract.

```
blocks_for_rewards = 2160
rewards = 1902587519025926

1 day = 1902587519025926 * 2160 = 4109589041096000160 = 4.1 DMZ
```

1. Deploy crowd sale (line variant) contract.

```
decimal = 25
price = 3000000000000000  // 3000 ZIL
buy_incentive = 200000000000000000000  // 200 DMZ
```

1. Deploy lvl up contract.

```
max_lvl = 5
min_lvl_for_earn_reward = 2
fee_multiplier = 100
```

1. Deploy name change contract.

```
min_lvl_for_change = 5
price_for_change = 250000000000000000000 // 250 DMZ
```

1. Deploy dummy marketplace contract.
1. Deploy auctions contract, set the marketplace addr as the dummy one.
1. Deploy marketplace contract.
1. Update auctions contract, `UpdateDirectListing(marketplace)`.

## Post Deployment
1. Update claim distributor - lvl up address `SetLvlUp(lvlup_addr)`
1. Add demon image URI in crowd sale contract, `AddReserveList(['image_uri_666', 'image_uri_665', '664'])` in **reverse order**
1. Invoke demons contract, `ConfigureMinter(crowd_sale)`, `ConfigureMinter(lvl_up)` and `ConfigureMinter(name_change)`
1. As the `wallet` defined in the crowd sale contract, call `IncreaseAllowance(crowd_sale, amt)` to allow crowd sale contract to distribute the buy incentives (DMZ) from `wallet`.
1. As the `wallet` defined in the claim distributor contract, call `IncreaseAllowance(claim, amt)` to allow the claim distributor to transfer the rewards from `wallet`.
1. Before the sale begins, in the crowd sale contract, call `UpdatePause()` to unpause the contract so that people can begin to `Buy()`.

## Maintenance


## Ownership Transfer
If ownership is transferred, the following have to be updated:
1. Demons contract, call `ConfigureMinter` to remove previous owner and add new owner as minter.

### 1: [Deploy Main ZRC1 contract:](https://github.com/Decentralised-Monsters/demons-scilla/tree/master/ZRC1/nft-demons.scilla)

Init:
```json
[
    {
        "type": "ByStr20",
        "value": "0x119929d8c388DE3650Ea1B3DC7b9Fe0ceEFE862F",
        "vname": "contract_owner"
    },
    {
        "type": "String",
        "value": "Demons",
        "vname": "name"
    },
    {
        "type": "String",
        "value": "DEM",
        "vname": "symbol"
    }
]
```
=> "0xeb9b2acf86d52c900fc01852bb351ebc91c96f38"

### 2: [Deploy Main ZRC2 (DMZ) contract:]((https://github.com/Decentralised-Monsters/demons-scilla/tree/master/ZRC2/dmz.scilla))

Init:
```json
[
    {
        "type": "ByStr20",
        "value": "0x119929d8c388DE3650Ea1B3DC7b9Fe0ceEFE862F",
        "vname": "contract_owner"
    },
    {
        "type": "String",
        "value": "Demon",
        "vname": "name"
    },
    {
        "type": "String",
        "value": "DMZ",
        "vname": "symbol"
    },
    {
        "type": "Uint32",
        "value": "18",
        "vname": "decimals"
    },
    {
        "type": "Uint128",
        "value": "1000000000000000000000000",
        "vname": "init_supply"
    }
]
```
=> "0xda914bcb7ad629b0ba3f84b33ab668faa4519ca0"

### 3: [Deploy Claim DMZ rewards contract:](https://github.com/Decentralised-Monsters/demons-scilla/tree/master/claim)

Init:
```json
[
    {
        "type": "ByStr20",
        "value": "0x119929d8c388DE3650Ea1B3DC7b9Fe0ceEFE862F",
        "vname": "contract_owner"
    },
    {
        "type": "ByStr20",
        "value": "0xda914bcb7ad629b0ba3f84b33ab668faa4519ca0",
        "vname": "dmz"
    },
    {
        "type": "ByStr20",
        "value": "0xeb9b2acf86d52c900fc01852bb351ebc91c96f38",
        "vname": "main"
    }
]
```
=> "0x1a490d1a57caacc6d231051a396215b4e433f949"

After deploy you need send some `DMZ` tokens to this contract, this tokens will be useing as rewards.
example: [viewblock](https://viewblock.io/zilliqa/tx/0x9e32146bdf76326977afbd79de2160017eb20f9ee668e52745eaa989fdd5b229?network=testnet)

### 4: [Deploy CrowdSale contract:](https://github.com/Decentralised-Monsters/demons-scilla/tree/master/crowd-sale)

Init:
```json
[
    {
        "type": "ByStr20",
        "value": "0x119929d8c388DE3650Ea1B3DC7b9Fe0ceEFE862F",
        "vname": "contract_owner"
    },
    {
        "type": "ByStr20",
        "value": "0x4ef291cEbD95ab4231eB52b02Cdf0E231Eab565a",
        "vname": "wallet"
    },
    {
        "type": "ByStr20",
        "value": "0x1a490d1a57caacc6d231051a396215b4e433f949",
        "vname": "distributor"
    },
    {
        "type": "ByStr20",
        "value": "0xeb9b2acf86d52c900fc01852bb351ebc91c96f38",
        "vname": "main"
    }
]
```
=> "0xa8c7405241ade8cb289e540568648acd1c014c24"

On the contract `Claim DMZ rewards` need call method `SetCrowdSale` with `address` = "0xa8c7405241ade8cb289e540568648acd1c014c24".
example: [viewblock](https://viewblock.io/zilliqa/tx/0xb442e9058531c95f8f7f7f0a3a137da1eb5cdaab9def6da8cb6b1def3a833024?network=testnet)


Also this CrowdSale contract should be minter, you need call on `Main` contract need call `ConfigureMinter` with `minter` = "0xa8c7405241ade8cb289e540568648acd1c014c24"
example: [viewblock](https://viewblock.io/zilliqa/tx/0x9b92b7e58d8a75d736f03d9358f68478ddeca9167545cb053ccb2b781f03eb8b?network=testnet)

### 5: [Deploy NameChange contract:](https://github.com/Decentralised-Monsters/demons-scilla/tree/master/name-change)

Init:
```json
[
    {
        "type": "ByStr20",
        "value": "0x119929d8c388DE3650Ea1B3DC7b9Fe0ceEFE862F",
        "vname": "contract_owner"
    },
    {
        "type": "ByStr20",
        "value": "0x4ef291cEbD95ab4231eB52b02Cdf0E231Eab565a",
        "vname": "wallet"
    },
    {
        "type": "ByStr20",
        "value": "0xda914bcb7ad629b0ba3f84b33ab668faa4519ca0",
        "vname": "dmz"
    },
    {
        "type": "ByStr20",
        "value": "0xeb9b2acf86d52c900fc01852bb351ebc91c96f38",
        "vname": "main"
    }
]
```
=> "0x1091f96a72677c8bea1cae379eeac8713a6e6ea6"

Also this NameChange contract should be minter, you need call on `Main` contract need call `ConfigureMinter` with `minter` = "0x1091f96a72677c8bea1cae379eeac8713a6e6ea6"
example: [viewblock](https://viewblock.io/zilliqa/tx/a3ffafabe603b299b92a43137f49acdadca5da58e40c214a222885004dd89888?network=testnet)

### 6: [Deploy level-up contract:](https://github.com/Decentralised-Monsters/demons-scilla/tree/master/lvl)

Init:
```json
[
    {
        "type": "ByStr20",
        "value": "0x119929d8c388DE3650Ea1B3DC7b9Fe0ceEFE862F",
        "vname": "contract_owner"
    },
    {
        "type": "ByStr20",
        "value": "0x4ef291cEbD95ab4231eB52b02Cdf0E231Eab565a",
        "vname": "wallet"
    },
    {
        "type": "ByStr20",
        "value": "0xda914bcb7ad629b0ba3f84b33ab668faa4519ca0",
        "vname": "dmz"
    },
    {
        "type": "ByStr20",
        "value": "0xeb9b2acf86d52c900fc01852bb351ebc91c96f38",
        "vname": "main"
    }
]
```
=> "0xa58bbeb4207205339dd24e2a430841b4bcc3b5a7"

Also this level-up contract should be minter, you need call on `Main` contract need call `ConfigureMinter` with `minter` = "0x1091f96a72677c8bea1cae379eeac8713a6e6ea6"
example: [viewblock](https://viewblock.io/zilliqa/tx/4665571b18bdb0acad2f105212aea77217b35add8ef064db15c6a0efa810fbf8?network=testnet)

### 7: [Deploy Auction contract:](https://github.com/Decentralised-Monsters/demons-scilla/tree/master/auction)

Before deploying auction contract, we need to deploy [dummy marketplace contract](/market-place/dummy_marketplace.scilla). Why? Because the auction contract requires the marketplace contract address as immutable field. We can deploy auction or marketplace first, but anyhow we need one of it to be dummy first.

Example, deploy auction contract first:
```
1. Deploy dummy marketplace
2. Deploy auction with dummy marketplace address as immutable field
3. Deploy marketplace with auction address
4. Update auction contract marketplace address by calling UpdateDirectListing() with deployed marketplace
```

OR

Deploy marketplace contract first:
```
1. Deploy dummy auction
2. Deploy marketplace with dummy auction address as immutable field
3. Deploy auction with marketplace address
4. Update marketplace contract auction address by calling UpdateAuctionListing() with deployed auction
```

Init:
```json
[
    {
        "type": "ByStr20",
        "value": "0x119929d8c388DE3650Ea1B3DC7b9Fe0ceEFE862F",
        "vname": "contract_owner"
    },
    {
        "type": "ByStr20",
        "value": "0x4ef291cEbD95ab4231eB52b02Cdf0E231Eab565a",
        "vname": "wallet"
    },
    {
        "type": "ByStr20",
        "value": "0xeb9b2acf86d52c900fc01852bb351ebc91c96f38",
        "vname": "main"
    },
    {
        "type": "ByStr20",
        "value": "0x6c4acb620d8c4032bbf104ccc12a22c936608c7d",
        "vname": "init_marketplace"
    }
]
```
=> "0x8550c1f62f4a40081600a6986c6e420a75ebdece"

Remeber to execute `UpdateDirectListing` to replace to dummy marketplace address once you have deployed the actual marketplace contract!


### 7: [Deploy MarketPlace contract:](https://github.com/Decentralised-Monsters/demons-scilla/tree/master/market-place)

Init:
```json
[
    {
        "type": "ByStr20",
        "value": "0x119929d8c388DE3650Ea1B3DC7b9Fe0ceEFE862F",
        "vname": "contract_owner"
    },
    {
        "type": "ByStr20",
        "value": "0x4ef291cEbD95ab4231eB52b02Cdf0E231Eab565a",
        "vname": "wallet"
    },
    {
        "type": "ByStr20",
        "value": "0xeb9b2acf86d52c900fc01852bb351ebc91c96f38",
        "vname": "main"
    },
    {
        "type": "ByStr20",
        "value": "0xda6bbb92765b58c7fafb152a3fc04a03b433b32b",
        "vname": "init_auction"
    }
]
```
=> "0x728f6affcdcf5fb8d9b13879c90ce9a4491a7e81"

Remeber to execute `UpdateAuctionListing` to replace to dummy auction address once you have deployed the actual auction contract!