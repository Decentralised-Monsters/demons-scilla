# Claim-Distributor

Contract to track if demons are generating rewards and allow users to claim.

 * **Claim** - transitions for getting rewards with dmz token.
 * - token_id (Uint256) - the `_sender` token id.
 * **OnBeginReward** - transition for LvlUp contract to initiate the rewarding if users raise their demons above certain level.
 * - token_id (Uint256) - the demon token id.
 * **SetRewards** - Settings for rewards `current_block - accumulated_block * rewards`
 * - blocks (BNum) - Amount of block for get minimum rewards.
 * - rewards_amount (Uint128) - Amount of rewards per `blocks`
 * **SetLvlUp** - Change the LvlUp contract.
 * - address (ByStr20) - LvlUp contract address.
 * **UpdateDMZ** - A admin transition to update the dmz contract address.
 * - new_dmz (ByStr20) - The new dmz contract address.
 * **UpdateWallet** - A owner transition to update the wallet address.
 * - new_wallet (ByStr20) - The new wallet address.
 * **RequestOwnershipTransfer** - Owner only transition to change owner. Current owner can abort process by call the transition with their own address.
 * - new_owner (ByStr20) - new owner address
 * **ConfirmOwnershipTransfer** - New contract owner can accept the ownership transfer request.

## Users Transitions
```Ocaml
contract DMZClaimContract
  Claim(token_id: Uint256)
  OnBeginReward(token_id: Uint256)
```

## Admin Transitions
```Ocaml
contract DMZClaimContract
  SetLvlUp(address: ByStr20)
  SetRewards(blocks: BNum, rewards_amount: Uint128)
  UpdateDMZ(new_dmz: ByStr20)
  UpdateWallet(new_wallet: ByStr20)
  RequestOwnershipTransfer(new_owner: ByStr20)
  ConfirmOwnershipTransfer()
```

## Callbacks
```Ocaml
contract AuctionFactory
  RecipientAcceptTransfer(sender: ByStr20, recipient: ByStr20, amount: Uint128)
  TransferSuccessCallBack(sender: ByStr20, recipient: ByStr20, amount: Uint128)
```

## Constructor

 * contract_owner - Admin of contract.
 * init_wallet - A wallet for transferring claimed rewards to users
 * init_dmz - The main ZRC2 tokens.
 * main - The Main NFT token address.

```Ocaml
contract DMZClaimContract
(
  contract_owner: ByStr20,
  init_wallet: ByStr20,
  init_dmz: ByStr20,
  main: ByStr20 with contract
    field token_owners: Map Uint256 ByStr20
  end
)
```

## Errors

 * CodeNotContractOwner - If `_sender` is not equal `contract_owner`
 * CodeNotFound - If cannot find something.
 * CodeNotLvlUp - If contract is not lvlup contract.
 * CodeTokenHolderAlreadyExists - If token already is generating rewards.
 * CodeNotTokenOwner - If `_sender` is not token owner.
 * CodeInputOutOfRange - If input if out of range.

```Ocaml
contract DMZClaimLib
  type Error =
    | CodeNotContractOwner             => Int32 -1
    | CodeNotFound                     => Int32 -2
    | CodeNotLvlUp                     => Int32 -3
    | CodeTokenHolderAlreadyExists     => Int32 -4
    | CodeNotTokenOwner                => Int32 -5
    | CodeInputOutOfRange              => Int32 -6
```

## Mutable fields
 * owner - current contract owner
 * pending_owner - new to-be contract owner
 * dmz - Tracks the current dmz contract.
 * wallet - Tracks the current wallet to transfer dmz
 * blocks_for_rewards - Minimum blocks for get rewards.
 * rewards - Amount of rewards.
 * token_holder - Stores the blocknumber for acumulate rewards.
 * lvl_up - LvlUp Contract address.

```Ocaml
contract DMZClaimContract
  field owner: ByStr20 = contract_owner
  field pending_owner: Option ByStr20 = None {ByStr20}
  field dmz: ByStr20 = init_dmz
  field wallet: ByStr20 = init_wallet
  field blocks_for_rewards: BNum = BNum 5000
  field rewards: Uint128 = Uint128 4000000000000000
  field token_holder: Map Uint256 Int256 = Emp Uint256 Int256

  field lvl_up: ByStr20 = zero_address
```

## Math model

The math model is very simple and distribute like line function.

Suppose we have
 * `blocks_for_rewards` = 5000
 * `rewards` = 4000000000000000

if we will multiply `blocks_for_rewards` for `rewards` we will get `20000000000000000000` this is can divide for ZRC2 token dicimal `18`

```python
(5000 * 4000000000000000) // 10**18 = 20 # 20 DMZ
```

### Daily Rewards
If we want to implement `30 DMZ` per **day** we can use this parmas:

`30 * 10**18` = 30000000000000000000

In the day `86400` seconds one block of Zilliqa 40 seconds:

`86400 // 40` = 2160

`blocks_for_rewards` = 2160
`rewards` = 30 * 10**18 // 2160 = 13888888888888888


### Yearly Rewards
To implement `150 DMZ` per **year**, we need to count the DMZ required per day.

Suppose there are 365 days in a year:
```
365 days = 150 DMZ
1 day = 0.413 DMZ = 413000000000000000
1 day = 2160 blocks
rewards_per_block = (413000000000000000 // 2160) = 191203703703703
```

So we can set the following:
```
`blocks_for_rewards` = 2160
`rewards` = 191203703703703
```

Testing the logic in `Claim`:
```
Suppose user bought NFT at Blk 3168486. 
After 24 hours, the user claims at Blk 3170646.

block_count = 3170646 - 3168486 = 2160
claim = 2160 * 191203703703703 = 412999999999998480 // 10**18 = 0.4129 DMZ
``


