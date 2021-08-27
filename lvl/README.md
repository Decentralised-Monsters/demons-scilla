# Level Up

 * Upgrade - For upgrade to next level. (Before use should be aproved on ZRC2 contract. via `IncreaseAllowance`)
 * - fee (Uint128) - Upgrade fee in DMZ.
 * - token_id (Uint256) - token id which going to upgrade.
 * SetMaxLVL - owner only method for change limit for lvl.
 * - value (Uint32) - the new value for `max_lvl`.
 * SetFeeMultiplier - owner only method to set a new fee multiplier.
 * - new_multiplier (Uint32) - the new value for `fee_multiplier`.
 * SetMinLvlReward - owner only method to change minimum lvl required to start earning rewards.min_lvl_for_earn_reward
 * - new_min_lvl (Uint32) - the new value for `min_lvl_for_earn_reward`.
 * **UpdateDMZ** - A owner transition to update the dmz contract address.
 * - new_dmz (ByStr20) - The new dmz contract address.
 * **UpdateWallet** - A owner transition to update the wallet address.
 * - new_wallet (ByStr20) - The new wallet address.
 * **UpdateDistributor** - A owner transition to update the distributor contract address.
 * - new_distributor (ByStr20) - The new distributor address.


## Users Transitions
```Ocaml
contract LVLUpContract
  Upgrade(amount: Uint128, token_id: Uint256)
```

## Owner Transitions
```Ocaml
contract LVLUpContract
  SetMaxLVL(value: Uint32)
  SetMinLvlReward(new_min_lvl: Uint32)
  SetFeeMultiplier(new_multiplier: Uint32)
  UpdateDMZ(new_dmz: ByStr20)
  UpdateWallet(new_wallet: ByStr20)
  UpdateDistributor(new_distributor: ByStr20)
```

## Callbacks
```Ocaml
contract LVLUpContract
  TransferFromSuccessCallBack(initiator: ByStr20, sender: ByStr20, recipient: ByStr20, amount: Uint128)
```

## Constructor

 * contract_owner - Admin of contract.
 * init_wallet - The wallet who will get rewards.
 * init_dmz - The main ZRC2 token address.
 * init_distributor - The claim distributor address.
 * main - The Main NFT token address.

```Ocaml
contract LVLUpContract
(
  contract_owner: ByStr20,
  init_wallet: ByStr20,
  init_dmz: ByStr20,
  init_distributor: ByStr20,
  main: ByStr20 with contract
    field token_lvl: Map Uint256 Uint32
  end
)
```

## Errors

 * CodeNotOwner - If `_sender` is not equal `contract_owner`
 * CodeNotFound - If cannot find something.
 * CodeMaxLVL - lvl more than `max_lvl`
 * CodeInsufficientFee - if user did not pay sufficient DMZ for the level up fee

```Ocaml
contract DMZClaimLib
  type Error =
    | CodeNotOwner => Int32 -1
    | CodeNotFound => Int32 -2
    | CodeMaxLVL   => Int32 -3
    | CodeInsufficientFee => Int32 -4
```

## Mutable Fields
 * dmz - Tracks the current dmz contract
 * wallet - Tracks the current wallet to receive the commission
 * distributor - Tracks the current distributor address to invoke the reward mechanism
 * max_lvl - The max lvl for token.
 * min_lvl_for_earn_reward - The minimum lvl required to enable reward mechanism.
 * fee_multiplier - The constant multiplier used to compute the level up fee.

```Ocaml
contract LVLUpContract
  field dmz: ByStr20 = init_dmz
  field wallet: ByStr20 = init_wallet
  field distributor: ByStr20 = init_distributor
  field max_lvl: Uint32 = Uint32 5
  field min_lvl_for_earn_reward: Uint32 = Uint32 2
  field fee_multiplier: Uint32 = Uint32 100
```

## Card Level Up Math model

All cards begin at level `0`. See [nft-demons.scilla](../ZRC1/nft-demons.scilla#L38). To unlock / upgrade to the next level, users must pay a level up fee.

The formula to calculate level up fee is:
```
fee = next_lvl * fee_multiplier * dmz_units

fee_multiplier = 100
dmz_units = 10^18
```

For instance, if a user is leveling a card from `0` -> `1`, the user must pay `(1 * 100 * 10^18)` = `100000000000000000000` which is the equivalent of 100 DMZ.

Simply put, the levelup fee chart looks like this:
| Level Up Fee |  Cost (DMZ) |
| ------------ | ----------- |
| 1            | 100         |
| 2            | 200         |
| 3            | 300         |
| 4            | 400         |
| x            | x*100       |

We can manipulate the `decimals` and `fee_multiplier` field to change the model:
```
let decimals = Uint128 1000000000000000000
field max_lvl: Uint32 = Uint32 5
field fee_multiplier: Uint32 = Uint32 100
```

