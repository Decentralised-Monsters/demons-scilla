# Start with the interface

* Buy - Method for buy mask
 - `_amount` - the Amount of ZILs.
* ReturnFunds - Just send the stored ZILs to `wallet`
* AddReserveList - Admin can add to list new masks.
 - token_uris_list (List String) - URLs to IPFS.
* MintCallBack - Contract able to mint new tokens.

transitions user only:
```Ocaml
contract BondingCurvedDistributor
  Buy()
  ReturnFunds()
```

transitions admin only:
```Ocaml
contract BondingCurvedDistributor
  AddReserveList(token_uris_list: List String)
```

transitions callbacks:
```Ocaml
contract AuctionFactory
  MintCallBack(recipient: ByStr20, token_id: Uint256, token_uri: String)
```

## Constructor

 * contract_owner - Admin of contract.
 * wallet - The wallet who will get rewards.
 * distributor - The claim contract.
 * main - The Main NFT token address.

```Ocaml
contract BondingCurvedDistributor
(
  contract_owner: ByStr20,
  wallet: ByStr20,
  distributor: ByStr20,
  main: ByStr20 with contract
    field token_id_count: Uint256
  end
)
```

## Errors

 * CodeNotContractOwner - If `_sender` is not equal `contract_owner`
 * CodeNotMain - If `_sender` is not main contract ZRC1.
 * CodeInsufficientFunds - If `_amount` not enough for buy a mask.

```Ocaml
contract DMZClaimLib
  type Error =
    | CodeNotMain           => Int32 -1
    | CodeInsufficientFunds => Int32 -2
    | CodeNotContractOwner  => Int32 -3
```

## Mutable fields

 * reserve - Amount of reserve tokens for minting.
 * total - Total of already minted tokens.
 * tokens_reserve - A Map with URLs.

```Ocaml
contract BondingCurvedDistributor

  field reserve: Uint256 = zero256
  field total: Uint256 = zero256

  field tokens_reserve: Map Uint256 String = Emp Uint256 String
```

## Math model

More understand [bonding-curves-in-depth](https://blog.relevant.community/bonding-curves-in-depth-intuition-parametrization-d3905a681e0a)

A bonding curve contract is an automatic market maker (a smart contract that enables users to buy tokens) with the following properties:

 * A token can be minted (bought) at any time according to a price set by a smart contract.
   This price increases as token supply grows.
 * The money ZILs paid for tokens is kept in the smart contract (reserve pool).

for settings price need change params of `customization` and `exponent`.

For params:
  * `customization` = 100000000000
  * `exponent` = 2
  * `total_supply` = 10

how get `pool_balance`:

`pool_balance = customization / (exponent + 1) * total_supply**(exponent + 1)` = `33333333333000`

```python
customization = 100000000000
exponent = 2
total_supply = 10

pool_balance = customization // (exponent + 1) * total_supply**(exponent + 1)
```

Now we need get a price:

For params:
  * `customization` = 100000000000
  * `exponent` = 2
  * `total_supply` = 10
  * `pool_balance` = 33333333333000

`price = (customization / (exponent + 1) (total_supply + 1) ** (exponent + 1)) - pool_balance` = `11033333333223`ZIL

```python
customization = 100000000000
exponent = 2
total_supply = 10
pool_balance = 33333333333000

price = (customization // (exponent + 1) * (total_supply + 1) ** (exponent + 1)) - pool_balance
```
