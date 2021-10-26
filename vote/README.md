# Voting

The voting system has two parts: (1) a voting manager contract which records all created vote contracts, (2) the vote contract itself.

The voting manager has a list of manager wallet addresses. Only managers can add or remove vote contract into the system. The frontend would fetch the list of vote contracts from the voting manager.

## Vote Manager
 * **AddVoteContract** - manager transition to track a new vote contract
 * - vote_address (ByStr20) - new vote address
 * - name (String) - vote name
 * - expiration_block (BNum) - block number that the vote will end
 * - reg_end_block (BNum) - block number that registration will end. After registration ends, users can start to vote.
 * **DeleteVoteContract** - manager transition to remove an existing vote contract from tracking
 * - id (Uint256) - vote id to be deleted.
 * **ConfigureManager** - owner transition to add or remove a manager.
 * - manager (ByStr20) - manager address
 * **RequestOwnershipTransfer** - Owner only transition to change owner. Current owner can abort process by call the transition with their own address.
 * - new_owner (ByStr20) - new owner address
 * **ConfirmOwnershipTransfer** - New contract owner can accept the ownership transfer request.

### Managers Transitions
```Ocaml
  contract VoteManager
    AddVoteContract(vote_address: ByStr20, name: String, expiration_block: BNum, reg_end_block: BNum)
    DeleteVoteContract(id: Uint256)
```

### Admin Transitions
```Ocaml
  contract VoteManager
    ConfigureManager(manager: ByStr20)
    RequestOwnershipTransfer(new_owner: ByStr20)
    ConfirmOwnershipTransfer()
```

### Constructor

  * contract_owner - admin of contract
  
```Ocaml
  contract VoteManager
    contract_owner : ByStr20
```

### Errors

  * CodeNotAuthorized
  * CodeContractAlreadyExists
  * CodeInvalidVoteID
  * CodeIsNotManager
  * CodeInvalidRegistrationBlock

```Ocaml
contract VoteManager
  type Error =
      | CodeNotAuthorized             => Int32 -1
      | CodeContractAlreadyExists     => Int32 -2
      | CodeInvalidVoteID             => Int32 -3
      | CodeIsNotManager              => Int32 -4
      | CodeInvalidRegistrationBlock  => Int32 -5
```

### Mutable Fields

  * owner
  * pending_owner
  * managers
  * vote_contracts
  * reverse_vote_contracts
  * vote_id


```Ocaml
contract VoteManager
    field owner: ByStr20 = contract_owner
    field pending_owner: Option ByStr20 = None {ByStr20}

    field managers: Map ByStr20 Dummy =
        let emp_map = Emp ByStr20 Dummy in
        builtin put emp_map contract_owner verdad

    field vote_contracts : Map Uint256 DemonVote = Emp Uint256 DemonVote

    field reverse_vote_contracts : Map ByStr20 Uint256 = Emp ByStr20 Uint256
    field vote_id : Uint256 = Uint256 0
```

\
## Vote Contract
 * **owner_register** - owner only transition to call register the list of voters addresses so that they can have the rights to vote.
 * - addresses (List ByStr20) - list of vote address
 * - credits (List Int32) - list of credits allocated to each voter
 * **register** - users need to register to be allocated credits to vote
 * **vote** - for users to cast their votes
 * - credits_sender_str (List String) - list of demon ids that the user is voting on
 * - credits_sender_int (List Int128) - list of credits voted for each demon ids

### Users Transitions
```Ocaml
  contract DemonVote
    register()
    vote(credits_sender_str: List String, credits_sender_int: List Int128)
```

### Admin Transitions
```Ocaml
  contract DemonVote
    owner_register(addresses : List ByStr20, credits : List Int32)
```

### Constructor

  * owner - admin of contract
  * expiration_block - final block at which votes are accepted
  * name - vote name
  * description - description of the vote
  * options - list of demon ids that are available for voting
  * credit_to_token_ratio - how many credits get issued for each token in the voters balance
  * registration_end_time - block after which users can't sign up for the election anymore
  * credit_spending_lower_limit - the lower limit of credit that can be used for voting on options
  * credit_spending_upper_limit - the upper limit of credit that can be used for voting on options

```Ocaml
  contract DemonVote
    owner: ByStr20,
    expiration_block: BNum,
    name: String,
    description: String,
    options: List String,
    credit_to_token_ratio: Int32,
    registration_end_time: BNum,
    credit_spending_lower_limit: Int32,
    credit_spending_upper_limit: Int32
```

### Errors

  * CodeSenderIsNotOwner
  * CodeTransitionOwnerRegisterMutipleCall
  * CodeNotInTime
  * CodeRegistrationDeadlineExceeded
  * CodeSenderAlreadyRegistered
  * CodeVoteCriteriaisNotMet
  * CodeCreditSentNotInAllocatedRange
  * CodeSenderNotRegisteredToVote
  * CodeInvalidVoteOption


```Ocaml
contract DemonVote
  type Error =
      | CodeSenderIsNotOwner                      => Int32 -1
      | CodeTransitionOwnerRegisterMutipleCall    => Int32 -2
      | CodeNotInTime                             => Int32 -3
      | CodeRegistrationDeadlineExceeded          => Int32 -4
      | CodeSenderAlreadyRegistered               => Int32 -5
      | CodeVoteCriteriaisNotMet                  => Int32 -6
      | CodeCreditSentNotInAllocatedRange         => Int32 -7
      | CodeSenderNotRegisteredToVote             => Int32 -8
      | CodeInvalidVoteOption                     => Int32 -9
```

### Mutable Fields

  * voter_balances
  * options_to_votes_map
  * registered_voters
  * owner_register_called


```Ocaml
contract DemonVote
    field voter_balances : Map ByStr20 Int32 = Emp ByStr20 Int32
    field options_to_votes_map : Map String Int128 = Emp String Int128
    field registered_voters : List ByStr20 = Nil {ByStr20}
    field owner_register_called : Bool = False
```