# Marketplace

The marketplace contract deals with NFTs that are sold at a fixed price. For NFTs that are sold in auction, please refer to the auctions section.

 * **Sell** - Sell a NFT on the marketplace.
 * - token_id (Uint256) - The approved `token_id` to be sold on marketplace.
 * - price (Uint128) - The cost of the NFT in DMZ.
 * **Purchase** - Buy a NFT from the marketplace.
 * - purchase_order_id (Uint256) - The `order_id` to buy the NFT.
 * **CancelListing** - Allows the seller to remove the NFT from the marketplace.
 * - cancel_order_id (Uint256) - The `order_id` to remove the NFT.
 * **CancelOrders** - Allows contract owner to remove NFTs. (when contract is paused)
 * - orders_list (List Uint256) - A list of `order_id` to remove the NFT.
 * **ChangeMarketPlaceFee** - Allows contract owner to change the marketplace fee percentage.
 * - new_fee (Uint128) - The new marketplace fee in percentage
 * **ChangePause** - Allows contract owner to pause/unpause the contract.
 * **UpdateAuctionListing** - Allows contract owner to update auction contract address.
 * - new_auction (ByStr20 with contract field token_auctions: Map Uint256 Uint256 end) - The new marketplace contract address.
 * **UpdateDMZ** - Allows contract owner to update dmz contract address.
 * - new_dmz (ByStr20) - The new dmz contract address.
 * **UpdateWallet** - Allows contract owner to update wallet address for receiving the commission.
 * - new_wallet (ByStr20) - The new wallet address.

## Users Transitions
```Ocaml
contract MarketPlace
  Sell(token_id: Uint256, price: Uint128)
  Purchase(purchase_order_id: Uint256)
  CancelListing(cancel_order_id : Uint256)
```

## Owner Transitions
```Ocaml
contract MarketPlace
  CancelOrders(orders_list: List Uint256)
  ChangeMarketPlaceFee(new_fee: Uint128)
  ChangePause()
  UpdateAuctionListing(new_auction: ByStr20 with contract field token_auctions: Map Uint256 Uint256 end)
  UpdateDMZ(new_dmz: ByStr20)
  UpdateWallet(new_wallet: ByStr20)
```

## Callbacks
```Ocaml
contract MarketPlace
  TransferFromSuccessCallBack(initiator: ByStr20, sender: ByStr20, recipient: ByStr20, amount: Uint128)
```

## Constructor

 * contract_owner - Admin of contract.
 * init_wallet - A wallet to store commission rewards.
 * init_dmz - The Main of ZRC2 contract.
 * main - The Main NFT token address.
 * init_auction - The auction contract.


```Ocaml
contract MarketPlace
(
  contract_owner: ByStr20,
  init_wallet: ByStr20,
  init_dmz: ByStr20,
  main: ByStr20 with contract
    field token_owners: Map Uint256 ByStr20
  end,
  init_auction: ByStr20 with contract
    field token_auctions: Map Uint256 Uint256
  end
)
```

## Errors

 * CodeMPNotApprovedToTransfer - If `token_id` not yet approved on demon contract for marketplace to transfer owner demon to marketplace.
 * CodeOrderNotFound - If `order_id` does not exists.
 * CodeNotAuthorized - If `_sender` is not authorized to execute transition.
 * CodeNotTokenOwner - If invoker is not `token_id` owner.
 * CodePauseNotPause - If contract is paused or unpaused.
 * CodeTokenListedInAuction - If `token_id` already exists in auction contract.
 * CodeTokenAlreadyListed - If `token_id` already exists.

```
contract MarketPlace
  type Error =
    | CodeMPNotApprovedToTransfer  => Int32 -1
    | CodeOrderNotFound            => Int32 -2
    | CodeNotAuthorized            => Int32 -3
    | CodeNotTokenOwner            => Int32 -4
    | CodePauseNotPause            => Int32 -5
    | CodeTokenListedInAuction     => Int32 -6
    | CodeTokenAlreadyListed       => Int32 -7
```

## Mutable Fields
 * dmz - Tracks the current dmz contract
 * wallet - Tracks the current wallet to receive the commission
 * auction_listing - Tracks the auction contract
 * pause - Tracks if the cotnract is paused/unpaused
 * order_id - Tracks the next available `order_id` to use
 * orderbook - Tracks marketplace listing; `order_id` -> `Order`
 * token_orderbook - Mapping of `token_id` -> `order_id`, required for other contracts to check if `token_id` already exists in marketplace
 * marketplace_fee - Value of dev commission by default 20%

```Ocaml
contract MarketPlace
  field dmz: ByStr20 = init_dmz
  field wallet: ByStr20 = init_wallet

  field auction_listing: ByStr20 with contract
    field token_auctions: Map Uint256 Uint256
  end = init_auction

  field pause: Uint32 = not_pause
  field order_id : Uint256 = Uint256 0
  field orderbook : Map Uint256 Order
                  = Emp Uint256 Order
  field token_orderbook : Map Uint256 Uint256 = Emp Uint256 Uint256     
  field marketplace_fee: Uint128 = Uint128 20 
```

## Dummy Marketplace Contract
To be explained in-depth.
Basically required for initial deployment because neither the auction contract nor marketplace contract is up.
See the main readme, deploy section for more info.