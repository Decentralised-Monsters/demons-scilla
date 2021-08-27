# Line Crowd Sale

The crowd sale contract contains the buy mechanism that will mint the demon. It uses a line-step curve formula to compute the price of each demon.

 * **AddReserveList** - An owner transition to update the list of token image uri. Image URI must be uploaded in reverse. E.g. start from 10.jpg, 09.jpg ... 01.jpg.
 * - token_uris_list (List String) - The list of demon image URIs, separated by commas in square brakcets, e.g. ["http://cloud/image/20.jpg", "http://cloud/image/19.jpg"...]
 * **ChangePrice**

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
  UpdateWallet(new_wallet: ByStr20)
```

## Callbacks
```Ocaml
contract LineCurvedDistributor
  MintCallBack(recipient: ByStr20, token_id: Uint256, token_uri: String)
```

## Constructor

  * contract_owner - Admin of contract.
  * init_wallet - A wallet for storing rewards or transfer dmz to users when they buy demon
  * main - The Main NFT token address.

```Ocaml
contract LineCurvedDistributor
(
  contract_owner: ByStr20,
  init_wallet: ByStr20,
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

```Ocaml
contract LineCurvedDistributor
  type Error =
    | CodeNotMain           => Int32 -1
    | CodeInsufficientFunds => Int32 -2
    | CodeNotContractOwner  => Int32 -3
    | CodeNotFound          => Int32 -4
```

## Mutable Fields
  * wallet - Tracks the current wallet to transfer dmz
  * reserve - Tracks the available demons to buy
  * total - Tracks the total demons minted so far
  * tokens_reserve - Contains list of demons image URIs
  * decimal - constant factor to compute the buy price
  * price - starting demon price

```Ocaml
contract LineCurvedDistributor
  field wallet: ByStr20 = init_wallet

  field reserve: Uint256 = zero256
  field total: Uint256 = zero256

  field tokens_reserve: Map Uint256 String = Emp Uint256 String
  field decimal: Uint256 = Uint256 26
  field price: Uint256 = Uint256 3000000000000000
```

## Math Model

To achieve a line step curve, the following formula is used:
```
  ((total_supply / decimal) + 1) * price
```
where `total_supply` is the current number of demons being minted, `decimal` is some constant factor and `price` is the starting price of the demon.