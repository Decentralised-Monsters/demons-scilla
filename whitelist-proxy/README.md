# FlatDistributorProxy

The proxy contract helps to whitelist the users for public sales.

 * **UpgradeTo** - Change the implementation public sales for the proxy
 * new_implementation (ByStr20) - Contract address of new public sales contract
 * **UpdateWhiteListedAddress** - Whitelist the addresses for public sales
 * whitelist (List ByStr20) - List of addresses to be whitelisted
 * **ChangeProxyAdmin** - Owner only transition to change owner. 
 * - newAdmin (ByStr20) - new owner address
 * **ClaimProxyAdmin** - New contract owner can accept the ownership transfer request.
 * **Buy** - Proxy call to buy the demons with Zil
 * **BuyDemonWithDMZ** - Proxy call to buy the demons with DMZ

## Users Transitions
```Ocaml
contract FlatDistributorProxy
  Buy()
  BuyDemonWithDMZ()
```

## Owner Transitions
```Ocaml
contract FlatDistributorProxy
  UpgradeTo(new_implementation: ByStr20)
  ChangeProxyAdmin(newAdmin: ByStr20)
  ClaimProxyAdmin()
  UpdateWhiteListedAddress(whitelist: List ByStr20)
```

## Constructor

 * init_admin - Owner of the contract.
 * init_implementation - Contract address of the public sales contract.

```Ocaml
contract FlatDistributorProxy(
  init_implementation: ByStr20,
  init_admin: ByStr20
)
```

## Errors

```Ocaml
contract FlatDistributorProxy
type Error =
  | CodeNotAdmin
  | CodeNotStagingAdmin
  | CodeNotWhitelisted
```

## Mutable fields

```Ocaml
contract FlatDistributorProxy
    field implementation: ByStr20 = init_implementation
    field admin: ByStr20 = init_admin
    field stagingadmin: Option ByStr20 = None {ByStr20}

    field whiteListedAddress: List (ByStr20) = Nil {ByStr20}
```
