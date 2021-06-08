# Start with the interface

 * Upgrade - For upgrade to next level. (Before use should be aproved on ZRC2 contract. via `IncreaseAllowance`)
  - amount (Uint128) - Amount of DMZ tokens.
  - token_id (Uint256) - token id which going to upgrade.
 * SetMaxLVL - Admin only method for change limit for lvl.
  - value (Uint32) - the new value for `max_lvl`.

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

## Math model

For customise need change the `decimals` value.

for params:
  * `amount` = 20000000000000000000
  * `DECIMAL` = 200000000000000000
  * `current_lvl` = 1000

`lvl = amount / DECIMAL + current_lvl`

```python
amount = 20000000000000000000
DECIMAL = 200000000000000000
current_lvl = 1000

lvl = amount // DECIMAL + current_lvl
```
