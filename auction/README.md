# Auction

Our auction contract will have a simple interface that allows users to place bids and, after the auction is complete, withdraw their funds. The owner of the auction needs to be able to cancel the auction in exceptional cases, and must also be allowed to withdraw the winning bid.

 * **CreateAuction** - A transition for create an auction.
 * - bid_increment (Uint128) - The incrementer price for bid.
 * - start_block (BNum) - the block number which auction shell start. (cannot be less or equal current_block)
 * - end_block (BNum) - The block number which auction shell end. (cannot be less or equal start_block)
 * - token_id (Uint256) - The approved `token_id` for place on auction.
 * **PlaceBid** - A transition for create a bid.
 * - id (Uint256) - The id of auction.
 * - _amount (Uint128) - value of DMZ.
 * **CancelAuction** - A transition for cancel auction (auction creator only.)
 * - id (Uint256) - The id of auction.
 * **Withdraw** - A transition for withdraw funds or token if sender is leader of auction.
 * - id (Uint256) - The id of auction.
 * **SetCommission** - A owner transition for change dev commission.
 * - value (Uint128) - The new dev commission percentage
 * **UpdateDirectListing** - A owner transition to update the marketplace contract address.
 * - new_marketplace (ByStr20 with contract field token_orderbook: Map Uint256 Uint256 end) - The new marketplace contract address.
 * **UpdateDMZ** - A owner transition to update the dmz contract address.
 * - new_dmz (ByStr20) - The new dmz contract address.
 * **UpdateWallet** - A owner transition to update the wallet address.
 * - new_wallet (ByStr20) - The new wallet address.

## Users Transitions
```Ocaml
contract AuctionFactory
  CreateAuction(bid_increment: Uint128, start_block: BNum, end_block: BNum, token_id: Uint256)
  PlaceBid(id: Uint256)
  CancelAuction(id: Uint256)
  Withdraw(id: Uint256)
```

## Owner Transitions
```Ocaml
contract AuctionFactory
  SetCommission(value: Uint128)
  UpdateDirectListing(new_marketplace: ByStr20 with contract field token_orderbook: Map Uint256 Uint256 end)
  UpdateDMZ(new_dmz: ByStr20)
  UpdateWallet(new_wallet: ByStr20)
```

## Callbacks
```Ocaml
contract AuctionFactory
  RecipientAcceptTransfer(sender: ByStr20, recipient: ByStr20, amount: Uint128)
  RecipientAcceptTransferFrom(from: ByStr20, recipient: ByStr20, token_id: Uint256)
  TransferFromSuccessCallBack(from: ByStr20, recipient: ByStr20, token_id: Uint256)
  TransferSuccessCallBack(from: ByStr20, recipient: ByStr20, token_id: Uint256)
```

## Constructor

 * contract_owner - Admin of contract.
 * init_wallet - A wallet for store commission rewards.
 * init_dmz - The Main of ZRC2 contract.
 * main - The Main NFT token address.
 * init_marketplace - The marketplace contract.


```Ocaml
contract AuctionFactory
(
  contract_owner: ByStr20,
  init_wallet: ByStr20,
  init_dmz: ByStr20,
  main: ByStr20 with contract
    field token_owners: Map Uint256 ByStr20
  end,
  init_marketplace: ByStr20 with contract
    field token_orderbook: Map Uint256 Uint256 
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

## Bid Mechanism
Some of these are self-explanatory, like canceled and `funds_by_bidder`. We’ll see how these are used when we start writing our contract’s functions. What about the rest?
Every auction needs an owner — the person to whom the winning bid will go if the auction completes successfully. If you were so inclined, you might want to separate out the “controller” (say, the person or contract that has permission to cancel the auction) from the “beneficiary” (the person or contract to whom the funds will go after the auction is over), but I’ll leave that as an exercise to the reader. For now, they’re one and the same.
Auctions also require a start and end time. Time in Scilla is a bit tricky — block timestamps are set by miners, and are not necessarily safe from spoofing. An emerging best practice is to demarcate time based on block number. We know with a fair amount of certainty that ZIlliqa blocks are generated roughly every 39 seconds; consequently we can infer timestamps from these numbers rather than the spoofable timestamp fields. Hence, `start_block` and `end_block`. If we build our UI correctly, this abstraction should be invisible to the user.

What about `bid_increment` and `highest_binding_bid`? It’s worth taking a moment to explain these. On many popular auction platforms, users are incentivized to bid the maximum they’re willing to pay by not binding them to that full amount, but rather to the previous highest bid plus the increment. That’s a mouthful, so let me give an example. Let’s say the current highest bid is $430, and the `bid_increment` is $10. You decide to bid $500. However, you are only obligated to pay $440 (the current highest bid + bid_increment) if you win the auction. In this case, $440 is the `highest_binding_bid`. If someone comes along and bids $450, you will still be the highestBidder, but the `highest_binding_bid` will be raised to $460. It’s sort of like asking the platform to automatically bid for you up to a given amount, after which point you’ll need to make a decision to raise your maximum bid or bow out. Just to be clear, anything you send in excess of `highest_binding_bid` will be refunded to you when you win the auction.

### Bid Mechanism (TLDR Version)
```
starting_price = 200
bid_increment = 10

1. User A bids 300      (highest_binding_bid = 300, highest_bid = 300)
2. User B bids 350      (highest_binding_bid = 310, highest_bid = 350)   <-- highest_binding_bid is 310 because the logic will increment the prev_highest_bid + increment (300 + 10) and then take min(310, 350)
3. User A raise to 400. (highest_binding_bid = 360, highest_bid = 400) <-- same logic as above min(360, 400)
3. Auction timed out. A wins.
4. A claims the card.  (360 is deducted from A)   <-- remaning 40 is transferred back to User A. A portion of the 360 will be the commission and transferred to the commission wallet. The remaning portion is sent to the auction creator.
5. B claims back funds (gets back his 350)
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
 * CodeIsOwner - If invoker is `token_id` owner.
 * CodeNotEndedOrCanceled - If auction in progress.
 * CodeOnlyWithdrawn - For only withdrawn amount and tokens.
 * CodeNotTokenOwner - If invoker is `token_id` owner.
 * CodeAuctionHasBid - If auction has existing bid.
 * CodeNotEnded - If auction has not yet ended.
 * CodeTokenAlreadyInAuction - If `token_id` already exists.
 * CodeTokenListedInDirectSale - If `token_id` already exists in marketplace contract.
 * CodeAuctionNotApprovedToTransfer - If `token_id` not yet approved on demon contract for auction to transfer owner demon to auction.

```Ocaml
contract AuctionFactoryLib
  type Error =
    | CodeNotContractOwner             => Int32 -1
    | CodeBlockGap                     => Int32 -2
    | CodeNotStartedYet                => Int32 -3
    | CodeAlreadyCanceled              => Int32 -4
    | CodeTimeOut                      => Int32 -5
    | CodeBipLessThanCurrent           => Int32 -6
    | CodeNotFound                     => Int32 -7
    | CodeIsOwner                      => Int32 -8
    | CodeNotEndedOrCanceled           => Int32 -9
    | CodeOnlyWithdrawn                => Int32 -10
    | CodeNotTokenOwner                => Int32 -11
    | CodeAuctionHasBid                => Int32 -12
    | CodeNotEnded                     => Int32 -13
    | CodeTokenAlreadyInAuction        => Int32 -14
    | CodeTokenListedInDirectSale      => Int32 -15
    | CodeAuctionNotApprovedToTransfer => Int32 -16
```


## Mutable fields
 * dmz - Tracks the current dmz contract
 * wallet - Tracks the current wallet to receive the commission
 * direct_listing - Tracks the current marketplace contract
 * funds_by_bidder - Storage for auction participants `_sender` -> `auction_id` -> `_amount`.
 * auctions - Storage for auction: `auction_id` -> `Auction`
 * bid_count - Count the number of bids per auction listing
 * token_auctions - Mapping of `token_id` -> `auction_id`, required for other contracts to check if `token_id` already exists in auction.
 * total - A counter for generate `auction_id`.
 * commission - Value of dev commission by default 10%.

```Ocaml
contract AuctionFactory
  field dmz: ByStr20 = init_dmz
  field wallet: ByStr20 = init_wallet

  field direct_listing: ByStr20 with contract 
    field token_orderbook: Map Uint256 Uint256 
  end = init_marketplace

  field funds_by_bidder: Map ByStr20 (Map Uint256 Uint128) 
    = Emp ByStr20 (Map Uint256 Uint128)

  field bid_count: Map Uint256 Uint64 = Emp Uint256 Uint64
  field token_auctions: Map Uint256 Uint256 = Emp Uint256 Uint256
  field auctions: Map Uint256 Auction = Emp Uint256 Auction
  field total: Uint256 = zero256
  field commission: Uint128 = Uint128 10
```