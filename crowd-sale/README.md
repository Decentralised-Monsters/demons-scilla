# Line Crowd Sale

The crowd sale contract contains the buy mechanism that will mint the demon. It uses a line-step curve formula to compute the price of each demon.

**Note**: A new crowd sale contract should be deployed for each new series release as we need to reset the `total` for computing the demon price.


## Line Crowd Sale (Support DMZ / ZIL Payment) (Latest - October 2021)
This is version 2 contract that supports DMZ / ZIL payment. This should be the default line crowd sale to deployed for future releases.

* [Line Crowd Sale v2](./line_crowd_sale_v2.scilla)
* [Line Crowd Sale v2 Readme](./line_crowd_sale_v2.md)


## Line Crowd Sale (Support ZIL Payment Only)

This is version 1 of the original line crowd sale contract that only supports ZIL payment. Please use the version 2 variant if you need to support DMZ payment.

 * **Buy** - Buy a demon. The demon will be minted by demon contract.
 * **AddReserveList** - An owner transition to update the list of token image uri. Image URI must be uploaded in reverse. E.g. start from 10.jpg, 09.jpg ... 01.jpg.
 * - token_uris_list (List String) - The list of demon image URIs, separated by commas in square brakcets, e.g. ["http://cloud/image/20.jpg", "http://cloud/image/19.jpg"...]
 * **ChangePrice** - An owner transition to change the starting selling price.
 * - value (Uint256) - new starting price
 * **ChangeDecimal** - An owner transition to change the constant factor in the line curve formula.
 * - value (Uint256) - new constant factor
 * **DrainContractBalance** - An owner transition to transfer the ZIL balance from the demon sales to `wallet`.
 * **UpdatePause** - Allows contract owner to pause/unpause the contract.
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
```

## Admin Transitions
```Ocaml
contract LineCurvedDistributor
  AddReserveList(token_uris_list: List String)
  ChangePrice(value: Uint256)
  ChangeDecimal(value: Uint256)
  DrainContractBalance()
  UpdatePause()
  UpdateDMZ(new_dmz: ByStr20)
  UpdateWallet(new_wallet: ByStr20)
  RequestOwnershipTransfer(new_owner: ByStr20)
  ConfirmOwnershipTransfer()
```

## Callbacks
```Ocaml
contract LineCurvedDistributor
  MintCallBack(recipient: ByStr20, token_id: Uint256, token_uri: String)
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

```Ocaml
contract LineCurvedDistributor
  type Error =
    | CodeNotMain           => Int32 -1
    | CodeInsufficientFunds => Int32 -2
    | CodeNotContractOwner  => Int32 -3
    | CodeNotFound          => Int32 -4
    | CodePauseNotPause     => Int32 -5
```

## Mutable Fields
  * owner - current contract owner
  * pending_owner - new to-be contract owner
  * dmz - Tracks the current dmz contract
  * wallet - Tracks the current wallet to transfer dmz
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