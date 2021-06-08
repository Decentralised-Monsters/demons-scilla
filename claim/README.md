# Start with the interface

 * Claim - transitions for getting rewards with dmz token.
  - token_id (Uint256) - the `_sender` token id.
 * SetRewards - Settings for rewards `current_block - accumulated_block * rewards`
  - blocks (BNum) - Amount of block for get minimum rewards.
  - rewards_amount (Uint128) - Amount of rewards per `blocks`
 * SetCrowdSale - Setup the Crowdsale contract.
  - address (ByStr20) - CrowdSale contract address.
 * RecipientAcceptTransfer - Contract can receive ZRC2 tokens.
 * TransferSuccessCallBack - Contract can make Tranfer ZRC2 tokens.

transitions user only:
```Ocaml
contract DMZClaimContract
  Claim(token_id: Uint256)
```

transitions admin only:
```Ocaml
contract DMZClaimContract
  SetCrowdSale(address: ByStr20)
  SetRewards(blocks: BNum, rewards_amount: Uint128)
```

transitions callbacks:
```Ocaml
contract AuctionFactory
  RecipientAcceptTransfer(sender: ByStr20, recipient: ByStr20, amount: Uint128)
  TransferSuccessCallBack(sender: ByStr20, recipient: ByStr20, amount: Uint128)
```

## Constructor

 * contract_owner - Admin of contract.
 * dmz - The main ZRC2 tokens.
 * main - The Main NFT token address.

```Ocaml
contract DMZClaimContract
(
  contract_owner: ByStr20,
  dmz: ByStr20,
  main: ByStr20 with contract
    field token_owners: Map Uint256 ByStr20
  end
)
```

## Errors

 * CodeNotContractOwner - If `_sender` is not equal `contract_owner`
 * CodeNotFound - If cannot find something.
 * CodeNotCrowdSale - If contract is not crowdsale.
 * CodeAlreadyExists - If already exists instance.
 * CodeNotTokenOwner - If `_sender` is not token owner.

```Ocaml
contract DMZClaimLib
  type Error =
    | CodeNotContractOwner  => Int32 -1
    | CodeNotFound          => Int32 -2
    | CodeNotCrowdSale      => Int32 -3
    | CodeAlreadyExists     => Int32 -4
    | CodeNotTokenOwner     => Int32 -5
```

## Mutable fields

 * blocks_for_rewards - Minimum blocks for get rewards.
 * rewards - Amount of rewards.
 * token_holder - Stores the blocknumber for acumulate rewards.
 * crowd_sale - CrowdSale Contract address.

```Ocaml
contract DMZClaimContract

  field blocks_for_rewards: BNum = BNum 5000
  field rewards: Uint128 = Uint128 4000000000000000
  field token_holder: Map Uint256 Int256 = Emp Uint256 Int256

  field crowd_sale: ByStr20 = zero_address
```

## Math model

The math model is very simple and distribute like line function.

We have
 * `blocks_for_rewards` = 5000
 * `rewards` = 4000000000000000

if we will multiply `blocks_for_rewards` for `rewards` we will get `20000000000000000000` this is can divide for ZRC2 token dicimal `18`

```python
(5000 * 4000000000000000) // 10**18 = 20 # 20 DMZ
```

If we want to implement `30DMZ` pear day we can use this parmas:

`30 * 10**18` = 30000000000000000000

In the day `86400` seconds one block of Zilliqa 40 seconds:

`86400 // 40` = 2160

`blocks_for_rewards` = 2160
`rewards` = 30 * 10**18 // 2160 = 13888888888888888
