# DMZ Distributor

Distributor for ZilSwap

## Things to do after Deploy
- Transfer DMZ to this contract so that users can claim
- Send PR to [ZilSwap](https://github.com/Switcheo/zap-api/blob/master/config/config.yml) to add DMZ for reward distribution

 * **ClaimMulti** - Claims from multiple epochs for a single account by providing proofs of inclusion.
 * - account (ByStr20) - The amount of tokens to claim.
 * - claims (List (Pair (Pair Uint32 Uint128) (List ByStr32))) - The claim data, which contains the epoch_number, amount and proof for the claim.
 * **Claim** - Claims from a distribution for an epoch by providing proof of inclusion.
 * - claim - The claim data, which contains the epoch number, leaf and proof for the claim.
 * **MigrateData** - owner transition to set the distribution merkle roots and claimed data for the next available epoch from a legacy distributor contract.
 * - legacy_contract (ByStr20 with contract field merkle_roots: Map Uint32 ByStr32, field claimed_leafs: Map Uint32 (Map ByStr32 Bool))
 * **SetMerkleRoot** - owner transition to set the distribution merkle root for the epoch.
 * - epoch_number (Uint32) - The epoch number for this distribution
 * - merkle_root (ByStr32) - The root of the merkle tree for this distribution
 * **RevokeOwnership** - owner transition to remove contract owner
 * **TransferOwnership** - Owner only transition to change owner. Current owner can abort process by call the transition with their own address.
 * - new_owner (ByStr20) - new owner address
 * **AcceptOwnership** - New contract owner can accept the ownership transfer request.

 ## Users Transitions
```Ocaml
contract DMZDistributor
  ClaimMulti(account: ByStr20, claims: List (Pair (Pair Uint32 Uint128) (List ByStr32)))
  Claim(claim: Claim)
```

## Admin Transitions
```Ocaml
contract DMZDistributor
  MigrateData(legacy_contract: ByStr20 with contract field merkle_roots: Map Uint32 ByStr32, field claimed_leafs: Map Uint32 (Map ByStr32 Bool) end)
  SetMerkleRoot(epoch_number: Uint32, merkle_root: ByStr32)
  RevokeOwnership()
  TransferOwnership(new_owner: ByStr20)
  AcceptOwnership()
```

## Callbacks
```Ocaml
contract DMZDistributor
  TransferSuccessCallBack(sender: ByStr20, recipient: ByStr20, amount: Uint128)
  RecipientAcceptTransfer(sender: ByStr20, recipient: ByStr20, amount: Uint128)
```

## Constructor

  * dmz_token_contract - main ZRC2 token address
  * init_owner - admin of contract

```Ocaml
contract DMZDistributor
(
  dmz_token_contract : ByStr20,
  init_owner : ByStr20
)
```

## Errors

  * CodeNotOwner
  * CodeNotPendingOwner
  * CodePendingOwnerNotEmpty
  * CodeInvalidEpoch
  * CodeInvalidProof
  * CodeAlreadyClaimed

```Ocaml
contract DMZDistributor
  type Error =
      | CodeNotOwner              => Int32 -1
      | CodeNotPendingOwner       => Int32 -2
      | CodePendingOwnerNotEmpty  => Int32 -3
      | CodeInvalidEpoch          => Int32 -4
      | CodeInvalidProof          => Int32 -5
      | CodeAlreadyClaimed        => Int32 -6
```

## Mutable Fields

  * contract_owner
  * pending_owner
  * merkle_roots
  * claimed_leafs
  * next_epoch_number

```Ocaml
contract DMZDistributor
    field contract_owner : Option ByStr20 = Some {ByStr20} init_owner
    field pending_owner : Option ByStr20 = none

    field merkle_roots : Map Uint32 ByStr32 (* epoch num -> merkle root *) = Emp Uint32 ByStr32

    field claimed_leafs : Map Uint32 (Map ByStr32 Bool) (* epoch num -> leaf hash -> True *) = Emp Uint32 (Map ByStr32 Bool)

    field next_epoch_number : Uint32 = Uint32 0
```