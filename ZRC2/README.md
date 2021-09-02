# DMZ

 * **IncreaseAllowance** - Increase allowance of a `spender`. Enables `spender` to utilize up to `amount` from `_sender` wallet.
 * - spender (ByStr20) - spender address
 * - amount (Uint128) - token amount that `spender` can use
 * **DecreaseAllowance** - Decrease allowance of a `spender`. Reduce the `amount` the `spender` can utilize from `_sender` wallet.
 * - spender (ByStr20) - spender address
 * - amount (Uint128) - token amount that `spender` can use
 * **Transfer** - Transfer DMZ to a recipient.
 * - to (ByStr20) - recipient address
 * - amount (Uint128) - amount of DMZ to send to recipient
 * **TransferFrom** - Transfer DMZ from `from` address to `to` address. `IncreaseAllowance` is required for `from` address.
 * - from (ByStr20) - DMZ to transferred from
 * - to (ByStr20) - DMZ to transferred to
 * - amount (Uint128) - amount of DMZ to send to `to` address
 * **RequestOwnershipTransfer** - Owner only transition to change owner. Current owner can abort process by call the transition with their own address.
 * - new_owner (ByStr20) - new owner address
 * **ConfirmOwnershipTransfer** - New contract owner can accept the ownership transfer request.

## Users Transitions
```Ocaml
contract DMZToken
  IncreaseAllowance(spender: ByStr20, amount: Uint128)
  DecreaseAllowance(spender: ByStr20, amount: Uint128)
  Transfer(to: ByStr20, amount: Uint128)
  TransferFrom(from: ByStr20, to: ByStr20, amount: Uint128)
```

## Owner Transitions
```Ocaml
contract DMZToken
  RequestOwnershipTransfer(new_owner: ByStr20)
  ConfirmOwnershipTransfer()
```

## Callbacks
```Ocaml
contract DMZToken
  RecipientAcceptTransfer(sender: ByStr20, recipient: ByStr20, amount: Uint128)
  RecipientAcceptTransferFrom(initiator: ByStr20, sender: ByStr20, recipient: ByStr20, amount: Uint128)
```

## Constructor

  * contract_owner - Admin of contract.
  * name - name of ZRC2 token
  * symbol - symbol of ZRC2 token
  * decimals - number of decimal places
  * init_supply - total supply

```Ocaml
contract DMZToken
(
  contract_owner: ByStr20,
  name : String,
  symbol: String,
  decimals: Uint32,
  init_supply : Uint128
)
```

## Errors

  * CodeIsSender - If `_sender` is `_sender`
  * CodeInsufficientFunds - If address does not have sufficient funds to transfer to recipient
  * CodeInsufficientAllowance - If `from` does not have sufficient allowance to transfer
  * CodeNotOwner - If `_sender` is not contract owner

```Ocaml
contract DMZToken
  type Error =
    | CodeIsSender              => Int32 -1
    | CodeInsufficientFunds     => Int32 -2
    | CodeInsufficientAllowance => Int32 -3
    | CodeNotOwner              => Int32 -4
```

## Mutable Fields
  * owner - current contract owner
  * pending_owner - new to-be contract owner
  * total_supply - total supply of the DMZ
  * balances - mapping of DMZ balances: `address` -> `DMZ`
  * allowances - mapping of DMZ allowance: `address` -> `DMZ`

```Ocaml
contract DMZToken
  field owner: ByStr20 = contract_owner
  field pending_owner: Option ByStr20 = None {ByStr20}
  
  field total_supply : Uint128 = init_supply

  field balances: Map ByStr20 Uint128 
    = let emp_map = Emp ByStr20 Uint128 in
        builtin put emp_map contract_owner init_supply

  field allowances: Map ByStr20 (Map ByStr20 Uint128) 
    = Emp ByStr20 (Map ByStr20 Uint128)
```