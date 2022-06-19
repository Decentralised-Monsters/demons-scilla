# FungibleLockup

The lockup contract locksup the tokens for the lockup period.

 * **Deposit** - Deposit the tokens to lockup before the lockup period has started
 * **WithdrawAfterDeadline** - Withdraw the deposited tokens after the deadline(lockup period).
 * **WithdrawBeforeDeadline** - Withdraw the desposited tokens before the deadline by paying penalty.


## Users Transitions
```Ocaml
contract FungibleLockup
  Deposit()
  WithdrawAfterDeadline()
  WithdrawBeforeDeadline()
```

## Callbacks
```Ocaml
contract FungibleLockup
  TransferSuccessCallBack(sender: ByStr20, recipient: ByStr20, amount: Uint128)
  RecipientAcceptTransfer(sender: ByStr20, recipient: ByStr20, amount: Uint128)
  RecipientAcceptTransferFrom(initiator: ByStr20, sender: ByStr20, recipient: ByStr20, amount: Uint128)
  TransferFromSuccessCallBack(initiator: ByStr20, sender: ByStr20, recipient: ByStr20, amount: Uint128)
```

## Constructor

 * contract_owner - Owner of the contract.
 * start_lockup_block - Block time to start lockup period.
 * end_lockup_block - Block time to end lockup period
 * fungible_token_contract - Token address to be locked
 * amount_to_lock - Static amount to be locked

```Ocaml
contract FungibleLockup
(
  contract_owner: ByStr20,
  start_lockup_block: BNum,
  end_lockup_block: BNum,
  fungible_token_contract: ByStr20 with end,
  amount_to_lock: Uint128
)
with
  builtin blt start_lockup_block end_lockup_block
=>
```

## Errors

```Ocaml
contract FungibleLockup
  type Error =
    | NotContractOwner
    | NotTimeToClaim
    | LockupEntryDeadlineMissed
    | UserAmountCurrentlyLocked
    | NoAmountFoundForUser
    | NotValidAmount
    | UserAlreadyExistsInLocker
```

## Mutable fields

```Ocaml
contract FungibleLockup
  field locker: Map ByStr20 Uint128 = Emp ByStr20 Uint128
```
