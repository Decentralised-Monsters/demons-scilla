# Line Crowd Sale v2

The crowd sale contract contains the buy mechanism that will mint the demon. It uses a line-step curve formula to compute the price of each demon.

Version 2 features buying with DMZ

 * **Buy** - Buy a demon with native ZILs. The demon will be minted by demon contract.
 * **BuyDemonWithDMZ** - Buy a demon with DMZ. The demon will be minted by demon contract.
 * **AddReserveList** - An owner transition to update the list of token image uri. Image URI must be uploaded in reverse. E.g. start from 10.jpg, 09.jpg ... 01.jpg.
 * - token_uris_list (List String) - The list of demon image URIs, separated by commas in square brakcets, e.g. ["http://cloud/image/20.jpg", "http://cloud/image/19.jpg"...]
 * **ChangePrice** - An owner transition to change the starting selling price.
 * - value (Uint256) - new starting price
 * **ChangeDecimal** - An owner transition to change the constant factor in the line curve formula.
 * - value (Uint256) - new constant factor
 * **ChangeIncentive** - An owner transition to change the buy rewards.
 * - value (Uint128) - new buy incentive in DMZ decimal places
 * **DrainContractBalance** - An owner transition to transfer the ZIL balance from the demon sales to `wallet`.
 * **UpdatePause** - Allows contract owner to pause/unpause the contract.
 * **UpdatePaymentMode** - A owner transition to toggle between paying with native ZILs and DMZ when users buy demons.
 * - new_payment_mode (Uint32) - The new payment mode.
 * **UpdateDMZ** - A owner transition to update the dmz contract address.
 * - new_dmz (ByStr20) - The new dmz contract address.
 * **UpdateWallet** - A owner transition to update the wallet address.
 * - new_wallet (ByStr20) - The new wallet address.
 * **RequestOwnershipTransfer** - Owner only transition to change owner. Current owner can abort process by call the transition with their own address.
 * - new_owner (ByStr20) - new owner address
 * **ConfirmOwnershipTransfer** - New contract owner can accept the ownership transfer request.

## Users Transitions
```Ocaml
contract LineCurvedDistributor
  Buy()
  BuyDemonWithDMZ()
```

## Admin Transitions
```Ocaml
contract LineCurvedDistributor
  AddReserveList(token_uris_list: List String)
  ChangePrice(value: Uint256)
  ChangeDecimal(value: Uint256)
  ChangeIncentive(value: Uint128)
  DrainContractBalance()
  UpdatePause()
  UpdatePaymentMode(new_payment_mode: Uint32)
  UpdateDMZ(new_dmz: ByStr20)
  UpdateWallet(new_wallet: ByStr20)
  RequestOwnershipTransfer(new_owner: ByStr20)
  ConfirmOwnershipTransfer()
```

## Callbacks
```Ocaml
contract LineCurvedDistributor
  MintCallBack(recipient: ByStr20, token_id: Uint256, token_uri: String)
  TransferFromSuccessCallBack(initiator: ByStr20, sender: ByStr20, recipient: ByStr20, amount: Uint128)
```

## Constructor

  * contract_owner - Admin of contract.
  * init_wallet - A wallet for transferring incentive dmz to users when they buy demon
  * init_dmz - the main ZRC2 token address.
  * main - The Main NFT token address.

```Ocaml
contract LineCurvedDistributor
(
  contract_owner: ByStr20,
  init_wallet: ByStr20,
  init_dmz: ByStr20,
  main: ByStr20 with contract
    field token_id_count: Uint256
  end
)
```

## Errors

  * CodeNotMain - If `MintCallBack` is not callback from `main`
  * CodeInsufficientFunds - If users do not have sufficient funds when buying demons.
  * CodeNotContractOwner - If transition is not invoked by contract owner.
  * CodeNotFound - If something is not found.
  * CodePauseNotPause - If contract is paused or unpaused.
  * CodeInvalidPaymentMode - If payment mode is invalid when updating.

```Ocaml
contract LineCurvedDistributor
  type Error =
    | CodeNotMain             => Int32 -1
    | CodeInsufficientFunds   => Int32 -2
    | CodeNotContractOwner    => Int32 -3
    | CodeNotFound            => Int32 -4
    | CodePauseNotPause       => Int32 -5
    | CodeInvalidPaymentMode  => Int32 -6
```

## Mutable Fields
  * owner - current contract owner
  * pending_owner - new to-be contract owner
  * dmz - Tracks the current dmz contract
  * wallet - Tracks the current wallet used to transfer buy rewards / store DMZ if payment mode is DMZ
  * reserve - Tracks the available demons to buy
  * total - Tracks the total demons minted so far
  * tokens_reserve - Contains list of demons image URIs
  * decimal - constant factor to compute the buy price
  * price - starting demon price
  * buy_incentive - DMZ rewards issued when users buy a demon
  * pause - Tracks if the cotnract is paused/unpaused

```Ocaml
contract LineCurvedDistributor
  field owner: ByStr20 = contract_owner
  field pending_owner: Option ByStr20 = None {ByStr20}

  field dmz: ByStr20 = init_dmz
  field wallet: ByStr20 = init_wallet
  field pause: Uint32 = on_pause
  field payment_mode: Uint32 = payment_mode_zil
  field reserve: Uint256 = zero256
  field total: Uint256 = zero256

  field tokens_reserve: Map Uint256 String = Emp Uint256 String
  field decimal: Uint256 = Uint256 26
  field price: Uint256 = Uint256 3000000000000000
  field buy_incentive: Uint128 = Uint128 200000000000000000000
```

## Math Model

To achieve a line step curve, the following formula is used:
```
  ((total_supply / decimal) + 1) * price
```
where `total_supply` is the current number of demons being minted, `decimal` is some constant factor and `price` is the starting price of the demon.