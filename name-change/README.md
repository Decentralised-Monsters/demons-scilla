# Start with the interface

 * SetName - Change name for dmz before call need aprove (`IncreaseAllowance`).
 * - token_id (Uint256) - The id of token whitch name will be changed.
 * - new_name (String) - new name for token.
 * ChangeMinLevel - Admin method for change min level for change name.
 * ChangePrice - Admin method for change price for change name.

transitions user only:
```Ocaml
contract NameContract
  SetName(token_id: Uint256, new_name: String)
```

transitions admin only:
```Ocaml
contract NameContract
  ChangeMinLevel(value: Uint32)
  ChangePrice(value: Uint128)
```

transitions callbacks:
```Ocaml
contract NameContract
  TransferFromSuccessCallBack(initiator: ByStr20, sender: ByStr20, recipient: ByStr20, amount: Uint128)
```

## Constructor

 * contract_owner - Admin of contract.
 * wallet - The wallet who will get rewards.
 * dmz - The main ZRC2 token address.
 * main - The Main NFT token address.

```Ocaml
contract NameContract
(
  contract_owner: ByStr20,
  wallet: ByStr20,
  dmz: ByStr20,
  main: ByStr20 with contract
    field token_lvl: Map Uint256 Uint32,
    field token_owners: Map Uint256 ByStr20
  end
)
```

## Errors

 * CodeNotOwner - If `_sender` is not equal `contract_owner`
 * CodeNotFound - If cannot find something.
 * CodeNotTokenOwner - If user is not owner of token.
 * CodeMinLVL - If token level less than `min_lvl_for_change`

```Ocaml
contract NameContract
  type Error =
    | CodeNotOwner      => Int32 -1
    | CodeMinLVL        => Int32 -2
    | CodeNotTokenOwner => Int32 -3
    | CodeNotFound      => Int32 -4
```

## Mutable fields

 * min_lvl_for_change - The min lvl for token.
 * price_for_change - The price for name change.

```Ocaml
contract NameContract

  field min_lvl_for_change: Uint32 = Uint32 5000
  field price_for_change: Uint128 = Uint128 150000000000000000000
```

## Math model

For customise need change the `min_lvl_for_change`, `price_for_change` value.
