# Start with the interface

 * Upgrade - For upgrade to next level. (Before use should be aproved on ZRC2 contract. via `IncreaseAllowance`)
 * - amount (Uint128) - Amount of DMZ tokens.
 * - token_id (Uint256) - token id which going to upgrade.
 * SetMaxLVL - Admin only method for change limit for lvl.
 * - value (Uint32) - the new value for `max_lvl`.

transitions user only:
```Ocaml
contract LVLUpContract
  Upgrade(amount: Uint128, token_id: Uint256)
```

transitions admin only:
```Ocaml
contract LVLUpContract
  SetMaxLVL(value: Uint32)
```

transitions callbacks:
```Ocaml
contract LVLUpContract
  transition TransferFromSuccessCallBack(initiator: ByStr20, sender: ByStr20, recipient: ByStr20, amount: Uint128)
```

## Constructor

 * contract_owner - Admin of contract.
 * wallet - The wallet who will get rewards.
 * distributor - The claim contract.
 * dmz - The main ZRC2 token address.
 * main - The Main NFT token address.

```Ocaml
contract LVLUpContract
(
  contract_owner: ByStr20,
  wallet: ByStr20,
  dmz: ByStr20,
  main: ByStr20 with contract
    field token_lvl: Map Uint256 Uint32
  end
)
```

## Errors

 * CodeNotOwner - If `_sender` is not equal `contract_owner`
 * CodeNotFound - If cannot find something.
 * CodeMaxLVL - lvl more than `max_lvl`

```Ocaml
contract DMZClaimLib
  type Error =
    | CodeNotOwner => Int32 -1
    | CodeNotFound => Int32 -2
    | CodeMaxLVL   => Int32 -3
```

## Mutable fields

 * max_lvl - The max lvl for token.

```Ocaml
contract LVLUpContract

  field max_lvl: Uint32 = Uint32 5999
```

## Card Level Up Math model

All cards begin at level `0`. See [nft-demons.scilla](../ZRC1/nft-demons.scilla#L38). To unlock / upgrade to the next level, users must pay a level up fee.

The formula to calculate level up fee is:
```
fee = next_lvl * fee_multiplier * dmz_units

fee_multiplier = 10
dmz_units = 10^18
```

For instance, if a user is leveling a card from `0` -> `1`, the user must pay `(1 * 10 * 10^18)` = `10000000000000000000` which is the equivalent of 10 DMZ.

Simply put, the levelup fee chart looks like this:
| Level Up Fee |  Cost (DMZ) |
| ------------ | ----------- |
| 1            | 10          |
| 2            | 20          |
| 3            | 30          |
| 4            | 40          |
| x            | x*10        |

We can manipulate the `decimals` and `fee_multiplier` field to change the model:
```
let decimals = Uint128 1000000000000000000
field max_lvl: Uint32 = Uint32 5
field fee_multiplier: Uint32 = Uint32 100
```

