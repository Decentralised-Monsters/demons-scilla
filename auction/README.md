# Start with the interface

Our auction contract will have a simple interface that allows users to place bids and, after the auction is complete, withdraw their funds. The owner of the auction needs to be able to cancel the auction in exceptional cases, and must also be allowed to withdraw the winning bid.

I’ve settled on the following interface, which should provide just enough expressiveness to handle this functionality. Notice that this is also a good time to think about the events that we might want these functions to emit.

 * CreateAuction - A transition for create an auction.
 * - bid_increment (Uint128) - The incrementer price for bid.
 * - start_block (BNum) - the block number which auction shell start. (cannot be less or equal current_block)
 * - end_block (BNum) - The block number which auction shell end. (cannot be less or equal start_block)
 * - token_id (Uint256) - The approved `token_id` for place on auction.
 * PlaceBid - A transition for create a bid.
 * - id (Uint256) - The id of auction.
 * - _amount (Uint128) - value of ZILs.
 * CancelAuction - A transition for cancel auction (auction creater only.)
 * - id (Uint256) - The id of auction.
 * Withdraw - A transition for withdraw funds or token if sender is leader of auction.
 * - id (Uint256) - The id of auction.
 * RemoveAuctionList - An admin transition for remove old auctions.
 * - id_list (List Uint256) - A list of id auctions.
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
 * - owner (ByStr20) - A creater of auction.
 * - bid_increment (Uint128) - Minimum price for bid.
 * - start_block (BNum) - block number which start auction.
 * - end_block (BNum) - block number wich end of auction.
 * - token_id (Uint256) - a NFT token placed on auction.
 * Auction - Data which can change until doesn't canceled or ended of time
 * - canceled (Bool) - Auction stage, user can cancel the auction.
 * - highest_binding_bid (Uint128) - the highest binding bid.
 * - highest bidder (ByStr20) - The leader of auction.
 * - owner_has_withdrawn (Bool) - If owner already withdrawn the ZILs.
 * - static - A static information.

```Ocaml
contract AuctionFactoryLib
  (* owner, bid_increment, start_block, end_block, token_id *)
  type StaticAuction =
    | StaticAuction of ByStr20 Uint128 BNum BNum Uint256

  (* custom ADT canceled, highest_binding_bid, highest_bidder, owner_has_withdrawn, static *)
  type Auction =
    | Auction of Bool Uint128 ByStr20 Bool StaticAuction
```

Some of these are self-explanatory, like canceled and `funds_by_bidder`. We’ll see how these are used when we start writing our contract’s functions. What about the rest?
Every auction needs an owner — the person to whom the winning bid will go if the auction completes successfully. If you were so inclined, you might want to separate out the “controller” (say, the person or contract that has permission to cancel the auction) from the “beneficiary” (the person or contract to whom the funds will go after the auction is over), but I’ll leave that as an exercise to the reader. For now, they’re one and the same.
Auctions also require a start and end time. Time in Scilla is a bit tricky — block timestamps are set by miners, and are not necessarily safe from spoofing. An emerging best practice is to demarcate time based on block number. We know with a fair amount of certainty that ZIlliqa blocks are generated roughly every 39 seconds; consequently we can infer timestamps from these numbers rather than the spoofable timestamp fields. Hence, `start_block` and `end_block`. If we build our UI correctly, this abstraction should be invisible to the user.

What about `bid_increment` and `highest_binding_bid`? It’s worth taking a moment to explain these. On many popular auction platforms, users are incentivized to bid the maximum they’re willing to pay by not binding them to that full amount, but rather to the previous highest bid plus the increment. That’s a mouthful, so let me give an example. Let’s say the current highest bid is $430, and the `bid_increment` is $10. You decide to bid $500. However, you are only obligated to pay $440 (the current highest bid + bid_increment) if you win the auction. In this case, $440 is the `highest_binding_bid`. If someone comes along and bids $450, you will still be the highestBidder, but the `highest_binding_bid` will be raised to $460. It’s sort of like asking the platform to automatically bid for you up to a given amount, after which point you’ll need to make a decision to raise your maximum bid or bow out. Just to be clear, anything you send in excess of `highest_binding_bid` will be refunded to you when you win the auction.


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