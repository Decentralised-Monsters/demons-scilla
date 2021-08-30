# Demons

 * **Mint** - Minters only transition to mint a demon.
 * - to (ByStr20) - recipient address
 * - token_uri (String) - image uri
 * **BatchMint** - Minters only transition to mint list of demon to a recipient.
 * - to (ByStr20) - recipient address
 * - token_uris_list (List String) - list of image uri
 * **Burn** - Burn a demon.
 * - token_id (Uint256) - Demon token id to be burnt
 * **SetApprove** - Approves or remove an address the ability to transfer a given `token_id`.
 * - to (ByStr20) - `approved_spender` address
 * - token_id (Uint256) - Demon token id
 * **SetApprovalForAll** - Sets or unsets an operator
 * - to (ByStr20) - address to be approved or removed.
 * **Transfer** - Token owner transition to transfer the ownership of a demon.
 * - to (ByStr20) - new token owner address
 * - token_id (Uint256) - Demon token id to be transferred.
 * **TransferFrom** - `approved_spender` or `operator` transition to transfer the demon ownership.
 * - to (ByStr20) - new token owner address
 * - token_id (Uint256) - Demon token id to be transferred.
 * **ConfigureMinter** - Owner only transition to add or remove the list of approved minters.
 * - minter (ByStr20) - minter address to approve or remove.
 * **ChangeLVL** - Minters only transition to change the demon level.
 * - token_id (Uint256) - Demon token id to be leveled up.
 * - value (Uint32) - new level.
 * **SetName** - Minters onyl transition to rename a demon.
 * - token_id (Uint256) - Demon token id to be renamed.
 * - new_name (String) - new demon name.
 * **SetImageURI** - Owner only transition to change the demon image uri.
 * - token_id (Uint256) - Demon token id to change the image uri.
 * - new_uri (String) - new image uri.
 * **RequestOwnershipTransfer** - Owner only transition to change owner. Current owner can abort process by call the transition with their own address.
 * - new_owner (ByStr20) - new owner address
 * **ConfirmOwnershipTransfer** - New contract owner can accept the ownership transfer request.

## Users Transitions
```Ocaml
contract Demons
  Burn(token_id: Uint256)
  SetApprove(to: ByStr20, token_id: Uint256)
  SetApprovalForAll(to: ByStr20)
  Transfer(to: ByStr20, token_id: Uint256)
  TransferFrom(to: ByStr20, token_id: Uint256)
``` 

## Minter Transitions
```Ocaml
contract Demons
  Mint(to: ByStr20, token_uri: String)
  BatchMint(to: ByStr20, token_uris_list: List String)
  ChangeLVL(token_id: Uint256, value: Uint32)
  SetName(token_id: Uint256, new_name: String)
```

## Owner Transitions
```Ocaml
contract Demons
  ConfigureMinter(minter: ByStr20)
  SetImageURI(token_id: Uint256, new_uri: String)
  RequestOwnershipTransfer(new_owner: ByStr20)
  ConfirmOwnershipTransfer()
``` 

## Constructor

 * contract_owner - Admin of contract.
 * name - name of the ZRC1 token.
 * symbol - symbol of the ZRC1 token.

```Ocaml
contract Demons
(
  contract_owner: ByStr20,
  name : String,
  symbol: String
)
```

## Errors

  * CodeNotContractOwner - If `_sender` is not equal `contract_owner`
  * CodeIsSelf - If `_sender` is equal to `address`
  * CodeTokenExists - If `token_id` already exists
  * CodeIsNotMinter - If `_sender` is not minter
  * CodeNotApproved - If `_sender` is not approved
  * CodeNotTokenOwner - If `_sender` is not token owner
  * CodeNotFound - If something is not found
  * CodeNotApprovedForAll - If `token_owner` is not approved operator
  * CodeNotOwnerOrOperator - If `token_owner` is not legitimate token owner or operator
  * CodeNotApprovedSpenderOrOperator - If `token_owner` is not approved or operator when invoking `TransferFrom`

```Ocaml
contract Demons
  type Error =
    | CodeNotContractOwner             => Int32 -1
    | CodeIsSelf                       => Int32 -2
    | CodeTokenExists                  => Int32 -3
    | CodeIsNotMinter                  => Int32 -4
    | CodeNotApproved                  => Int32 -5
    | CodeNotTokenOwner                => Int32 -6
    | CodeNotFound                     => Int32 -7
    | CodeNotApprovedForAll            => Int32 -8
    | CodeNotOwnerOrOperator           => Int32 -9
    | CodeNotApprovedSpenderOrOperator => Int32 -10
```

## Mutable Fields
  * owner - current contract owner
  * pending_owner - new to-be contract owner
  * minters - mapping of approved minters
  * token_owners - mapping of `token_id` -> `token_owner`
  * token_name - mapping of `token_id` -> `demon_name`
  * token_lvl - mapping of `token_id` -> `demon_lvl`
  * owned_token_count - mapping of `token_owner` -> `demon_count`
  * token_approvals - mapping of `token_id` -> `approved_spender`. Only one approved spender per token at any given time
  * operator_approvals - mapping of `token_owner` -> `operator`
  * token_uris - mapping of `token_id` -> `image_uri`
  * total_supply - total demon count
  * token_id_count - tracks next available demon `token_id`

```Ocaml
contract Demons
  field owner: ByStr20 = contract_owner
  field pending_owner: Option ByStr20 = None {ByStr20}
  
  field minters: Map ByStr20 Dummy =
    let emp_map = Emp ByStr20 Dummy in
    builtin put emp_map contract_owner verdad

  field token_owners: Map Uint256 ByStr20 = Emp Uint256 ByStr20
  field token_name: Map Uint256 String = Emp Uint256 String
  field token_lvl: Map Uint256 Uint32 = Emp Uint256 Uint32
  field owned_token_count: Map ByStr20 Uint256 = Emp ByStr20 Uint256
  field token_approvals: Map Uint256 ByStr20 = Emp Uint256 ByStr20

  field operator_approvals: Map ByStr20 (Map ByStr20 Dummy)
                            = Emp ByStr20 (Map ByStr20 Dummy)

  field token_uris: Map Uint256 String = Emp Uint256 String
  field total_supply: Uint256 = zero
  field token_id_count: Uint256 = zero
```