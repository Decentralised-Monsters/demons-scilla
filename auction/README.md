# Start with the interface

Our auction contract will have a simple interface that allows users to place bids and, after the auction is complete, withdraw their funds. The owner of the auction needs to be able to cancel the auction in exceptional cases, and must also be allowed to withdraw the winning bid.

I’ve settled on the following interface, which should provide just enough expressiveness to handle this functionality. Notice that this is also a good time to think about the events that we might want these functions to emit.

 * CreateAuction - A transition for create an auction.
  - bid_increment (Uint128) - The min price for bid.
  - start_block (BNum) - the block number which auction shell start. (cannot be less or equal current_block)
  - end_block (BNum) - The block number which auction shell end. (cannot be less or equal start_block)
  - token_id (Uint256) - The approved `token_id` for place on auction.
 * PlaceBid - A transition for create a bid.
  - id (Uint256) - The id of auction.
  - _amount (Uint128) - value of ZILs.
 * CancelAuction - A transition for cancel auction (auction creater only.)
  - id (Uint256) - The id of auction.
 * Withdraw - A transition for withdraw funds or token if sender is leader of auction.
  - id (Uint256) - The id of auction.
 * RemoveAuctionList - An admin transition for remove old auctions.
  - id_list (List Uint256) - A list of id auctions.
 * SetCommission - An admin transition for change dev commission.

transitions user only:
```Ocaml
contract AuctionFactory
  CreateAuction(bid_increment: Uint128, start_block: BNum, end_block: BNum, token_id: Uint256)
  PlaceBid(id: Uint256)
  CancelAuction(id: Uint256)
  Withdraw(id: Uint256)
```

transitions admin only:
```Ocaml
contract AuctionFactory
  RemoveAuctionList(id_list: List Uint256)
  SetCommission(value: Uint128)
```

transitions callbacks:
```Ocaml
contract AuctionFactory
  RecipientAcceptTransferFrom(from: ByStr20, recipient: ByStr20, token_id: Uint256)
  TransferFromSuccessCallBack(from: ByStr20, recipient: ByStr20, token_id: Uint256)
  TransferSuccessCallBack(from: ByStr20, recipient: ByStr20, token_id: Uint256)
```

## Constructor

 * contract_owner - Admin of contract.
 * wallet - A wallet for store commission rewards.
 * main - The Main NFT token address.

```Ocaml
contract AuctionFactory
(
  contract_owner: ByStr20,
  wallet: ByStr20,
  main: ByStr20 with contract
    field token_owners: Map Uint256 ByStr20
  end
)
```

## Custom types

 * StaticAuction - Data which doesn’t change over the life of the contract
  - owner (ByStr20) - A creater of auction.
  - bid_increment (Uint128) - Minimum price for bid.
  - start_block (BNum) - block number which start auction.
  - end_block (BNum) - block number wich end of auction.
  - token_id (Uint256) - a NFT token placed on auction.
 * Auction - Data which can change until doesn't canceled or ended of time
  - canceled (Bool) - Auction stage, user can cancel the auction.
  - highest_binding_bid (Uint128) - the highest binding bid.
  - highest bidder (ByStr20) - The leader of auction.
  - owner_has_withdrawn (Bool) - If owner already withdrawn the ZILs.
  - static - A static information.

```Ocaml
contract AuctionFactoryLib
  (* owner, bid_increment, start_block, end_block, token_id *)
  type StaticAuction =
    | StaticAuction of ByStr20 Uint128 BNum BNum Uint256

  (* custom ADT canceled, highest_binding_bid, highest_bidder, owner_has_withdrawn, static *)
  type Auction =
    | Auction of Bool Uint128 ByStr20 Bool StaticAuction
```


## Errors

 * CodeNotContractOwner - If `_sender` is not equal `contract_owner`
 * CodeBlockGap - If `start_block` and `end_block` is misplaced.
 * CodeNotStartedYet - If the `start_block` < `current_block_number`
 * CodeAlreadyCanceled - If auction was canceled by owner.
 * CodeTimeOut - If `end_block` < `current_block_number`
 * CodeIsOwner - If `_sender` is not owner of auction.
 * CodeBipLessThanCurrent - if `_amount` < `highest_binding_bid`
 * CodeNotFound - If id of auction doesn't found.
 * CodeNotEndedOrCanceled - If auction in progress.
 * CodeOnlyWithdrawn - For only withdrawn amount and tokens.

```Ocaml
contract AuctionFactoryLib
  type Error =
    | CodeNotContractOwner   => Int32 -1
    | CodeBlockGap           => Int32 -2
    | CodeNotStartedYet      => Int32 -3
    | CodeAlreadyCanceled    => Int32 -4
    | CodeTimeOut            => Int32 -5
    | CodeBipLessThanCurrent => Int32 -6
    | CodeNotFound           => Int32 -7
    | CodeIsOwner            => Int32 -8
    | CodeNotEndedOrCanceled => Int32 -9
    | CodeOnlyWithdrawn      => Int32 -10
```


## Mutable fields

 * funds_by_bidder - Storage for auction participants `_sender` -> `auction_id` -> `_amount`.
 * auctions - Storage for auction: `auction_id` -> `Auction`
 * total - A counter for generate `auction_id`.
 * commission - Value of dev commission by default 10%.

```Ocaml
contract AuctionFactory

field funds_by_bidder: Map ByStr20 (Map Uint256 Uint128) 
  = Emp ByStr20 (Map Uint256 Uint128)

field auctions: Map Uint256 Auction = Emp Uint256 Auction
field total: Uint256 = zero256
field commission: Uint128 = Uint128 10
```