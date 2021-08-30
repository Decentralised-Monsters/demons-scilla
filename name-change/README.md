# Name Change

The name change contract checks for minimum level required before allowing users to rename their demons.

 * **SetName** - Change name for dmz before call need aprove (`IncreaseAllowance`).
 * - token_id (Uint256) - The id of token whitch name will be changed.
 * - new_name (String) - new name for token.
 * **ChangeMinLevel** - owner method for change min level for change name.
 * - value (Uint32) - new minimum level.
 * **ChangePrice** - owner method for change price for change name.
 * - value (Uint128) - new price.
 * **UpdateDMZ** - A owner transition to update the dmz contract address.
 * - new_dmz (ByStr20) - The new dmz contract address.
 * **UpdateWallet** - A owner transition to update the wallet address.
 * - new_wallet (ByStr20) - The new wallet address.
 * **RequestOwnershipTransfer** - Owner only transition to change owner. Current owner can abort process by call the transition with their own address.
 * - new_owner (ByStr20) - new owner address
 * **ConfirmOwnershipTransfer** - New contract owner can accept the ownership transfer request.

## Users Transitions
```Ocaml
contract NameContract
  SetName(token_id: Uint256, new_name: String)
```

## Owner Transitions
```Ocaml
contract NameContract
  ChangeMinLevel(value: Uint32)
  ChangePrice(value: Uint128)
  UpdateDMZ(new_dmz: ByStr20)
  UpdateWallet(new_wallet: ByStr20)
  RequestOwnershipTransfer(new_owner: ByStr20)
  ConfirmOwnershipTransfer()
```

## Callbacks
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
  init_wallet: ByStr20,
  init_dmz: ByStr20,
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
 * CodeInputOutOfRange - If input is out of range.

```Ocaml
contract NameContract
  type Error =
    | CodeNotOwner        => Int32 -1
    | CodeMinLVL          => Int32 -2
    | CodeNotTokenOwner   => Int32 -3
    | CodeNotFound        => Int32 -4
    | CodeInputOutOfRange => Int32 -5
```

## Mutable fields
 * owner - current contract owner
 * pending_owner - new to-be contract owner
 * dmz - Tracks the current dmz contract
 * wallet - Tracks the current wallet to receive dmz
 * min_lvl_for_change - The min lvl for token.
 * price_for_change - The price for name change.

```Ocaml
contract NameContract
  field owner: ByStr20 = contract_owner
  field pending_owner: Option ByStr20 = None {ByStr20}
  field dmz: ByStr20 = init_dmz
  field wallet: ByStr20 = init_wallet
  field min_lvl_for_change: Uint32 = Uint32 5
  field price_for_change: Uint128 = Uint128 100000000000000000000
```

## Math model

For customise need change the `min_lvl_for_change`, `price_for_change` value.
