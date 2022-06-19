# Staking

The staking contract enables fixed APR staking for dmz.

 * **initializeContract** - Intialize the contract with owner, rewardBlocks, lastReward, rewardTime, nextRewardBlock and lastRewardBlock.
 * **addWhitelistAddress** - Add an address to the whitelist for staking.
 * - address (ByStr20) - address of the user.
 * **removeWhitelistAddress** - Remove an address of the whitelist for staking.
 * - address (ByStr20) - address of the user.
 * **changeRewardBlocks** - Change next reward block.
 * - block (Uint128) - next block number.
 * **pauseContract** - Pause the transitions in a contract.
 * **unpauseContract** - Unpause the transitions in a contract.
 * **rewardAll** - Reward all the stakers.
 * **rewardCycleRewards** - Cycle reward for all the stakers.
 * **addStakeForOthers** - Add the stake amount for another address.
 * - address (ByStr20) - stake owner address
 * - amount (Uint128) - amount to be staked
 * **removePendingAddStakeForOthers** - Remove the stake amount created for others
 * **changeCulmulative** - Toggle the automatic cummulation of rewards and manual claim
 * **withdrawPending** - Withdraw the pending rewards from the staking contract
 * **removeStakeIfEpochZero** - Allows the user to remove the staking amount if they staked in 0 epoch when the rewards arenot distributed.
 * **removeStake** - Remove the desired stake from the contract. This can be withdrawn after the withdraw period or automatically by paying penalty.
 * - amount (Uint128) - Amount to be removed.
 * **withdrawStake** - Withdraw the removed stake after the withdraw period.
 * **automaticWithdrawStake** - Withdraw stakes of any user after the withdraw period by claiming fees.
 * recipient (ByStr20) - receiver of the stake
 * **instantWithdrawal** - Withdrawal of the token instantly by paying the penalty fee without completing the withdrawal period.
 * **transferStakeToNewContract** - Transfers stake data to the new staking contract
 * address (ByStr20) - User's address to transfer the staking data
 * **transferUnstakeToNewContract** - Transfers unstake data to the new staking contract
 * address (ByStr20) - User's address to transfer the unstaking data
 * **transferStakeSuccessfulCallBack** - Transfer the token of the address to new staking contract after successful stake data transfer
 * address (ByStr20) - User's address to transfer the staking tokens
 * **transferUnstakeSuccessfulCallBack** - Transfer the token of the address to new staking contract after successful unstake data transfer
 * address (ByStr20) - User's address to transfer the unstaking tokens
 * **changeFutureContractAddress** - Add new staking contract
 * address (ByStr20) - New staking contract address
 * **setBurnAddress** - Change the burn address
 * address (ByStr20) - Burn address (Zero address)
 * **ownerWithdrawAdded** - Withdraw tokens by the owner
 * amount (Uint128) - Amount to be withdrawn
 * **changeTierCycle** - Change the tier cycle for the address
 * addr (ByStr20) - Address to be changed cycle
 * cycle (Uint128) - New cycle number for the address
 * **changeEpochCount** - Change the epoch for the reward distribution
 * cycle (Int32) - New epoch for the reward distribution
 * **changeUnstakeBlocks** - Change the withdrawal period of staking
 * cycle (Uint64) - New withdrawal period of the reward distribution
 * **changePenalty** - Change the penalty rate of withdraw automatically
 * rate (Uint128) - New penalty rate
 * days (Uint128) - Number of days for withdrawal
 * **setBurnPercent** - Change the burn percentage of the token
 * rate (Uint128) - New burn rate
 * **changeRewardPercent** - Change the reward percentage of the staking
 * rate (Uint128) - New reward rate
 * **setAutoFee** - Change the fee amount
 * amount (Uint128) - New fee amount
 * **useWhitelist** - Use whitelist while staking
 * **removeWhitelist** - Allow staking for everyone
 * **toggleDailyToWeekly** - Toggle the reward distribution between daily and weekly
 * **changeMinimumStake** - Change the minimum stake amount
 * amount (Uint128) - New minimum stake amount
 * **RecipientAcceptTransfer** - When token is sent to the contract
 * sender (ByStr20) - Sender of the token
 * recipient (ByStr20) - Receiver of the token
 * amount (Uint128) - Amount to be transferred
 * **TransferSuccessCallBack** - When token is sent from the contract
 * sender (ByStr20) - Sender of the token
 * recipient (ByStr20) - Receiver of the token
 * amount (Uint128) - Amount to be transferred
 * **updatedmzAddress** - Update the token address of the DMZ
 * addr (ByStr20) - New token address
 * **TransferStakeToNew** - Accept Transfer stake if it is the implementation contract
 * staker_address (ByStr20) - Address of the staker
 * staked_amount (Uint128) - Staked Amount
 * cycleAmount (Uint128) - Cycle Number of the staking
 * cycleCount (Int32) - Cycle count of the staking
 * **TransferUnstakeToNew** - Accept Transfer unstake if it is the implementation contract
 * staker_address (ByStr20) - Address of the staker
 * unstaked_amount (Uint128) - Unstaked Amount
 * unstaked_blocks (BNum) - Unstaked block number of the unstaker
 * **RequestOwnershipTransfer** - Owner only transition to change owner. 
 * - new_owner (ByStr20) - new owner address
 * **ConfirmOwnershipTransfer** - New contract owner can accept the ownership transfer request.


## Users Transitions
```Ocaml
contract DmzStake
  addStakeForOthers(address: ByStr20, amount: Uint128)
  removePendingAddStakeForOthers()
  changeCulmulative()
  withdrawPending()
  removeStakeIfEpochZero()
  removeStake(amount: Uint128)
  withdrawStake()
  automaticWithdrawStake(recipient: ByStr20)
  instantWithdrawal()
```

## Owner Transitions
```Ocaml
contract DmzStake
  initializeContract()
  addWhitelistAddress(address: ByStr20)
  removeWhitelistAddress(address: ByStr20)
  changeRewardBlocks(block: Uint128)
  pauseContract()
  unpauseContract()
  rewardAll()
  rewardCycleRewards()
  transferStakeToNewContract(address: ByStr20)
  transferUnstakeToNewContract(address: ByStr20)
  changeImplementationContractAddress(address: ByStr20)
  changeFutureContractAddress(address: ByStr20)
  setBurnAddress(address: ByStr20)
  ownerWithdrawAdded (amount: Uint128)
  changeTierCycle (addr: ByStr20, cycle: Uint128)
  changeEpochCount (cycle: Int32)
  changeUnstakeBlocks (blocks: Uint64)
  changeUnstakeRate (rate: Uint128)
  changePenalty (rate: Uint128, days: Uint128)
  setBurnPercent (rate: Uint128)
  changeRewardPercent (rate: Uint128)
  setAutoFee(amount: Uint128)
  useWhitelist ()
  removeWhitelist ()
  toggleDailyToWeekly ()
  changeMinimumStake(amount: Uint128)
  updatedmzAddress(addr: ByStr20)
  RequestOwnershipTransfer(new_owner : ByStr20)
  ConfirmOwnershipTransfer()
```

## Callbacks
```Ocaml
contract DmzStake
  transferStakeSuccessfulCallBack(address: ByStr20)
  transferUnstakeSuccessfulCallBack(address: ByStr20)
  RecipientAcceptTransfer(
  sender : ByStr20,
  recipient : ByStr20,
  amount : Uint128
  )
  TransferSuccessCallBack(
    sender : ByStr20,
    recipient : ByStr20,
    amount : Uint128
  )
  TransferStakeToNew (staker_address : ByStr20, staked_amount : Uint128, cycleAmount : Uint128, cycleCount : Int32)
  TransferUnstakeToNew(staker_address : ByStr20, unstaked_amount : Uint128, unstaked_blocks : BNum)
```

## Constructor

 * initial_owner - Owner of the contract.
 * dmzContract - Contract address of the DMZ.

```Ocaml
contract DmzStake
(
  initial_owner : ByStr20,
  dmzContract : ByStr20
)
```

## Errors

```Ocaml
contract DmzStake
  type Error =
    | CodeIsNotSender => Int32 -1
    | CodeInsufficientDmz => Int32 -2
    | CodeExceedAvailable => Int32 -3
    | CodeNotStaker => Int32 -4
    | CodeBlockNotReach => Int32 -5
    | CodeNoPending => Int32 -6
    | CodeWrongToken => Int32 -7
    | CodeContractPaused => Int32 -8
    | CodeNotWhitelisted => Int32 -9
    | CodeLessThanMinimumStake => Int32 -10
    | CodeRewardBlocksNotMet => Int32 -11
    | CodeWrongAmountStaked => Int32 -12
    | CodeNotImplementation => Int32 -13
    | CodeNotEpochZero      => Int32 -14
```

## Mutable fields

```Ocaml
contract DmzStake
  field current_owner : ByStr20 = initial_owner
  field pending_owner : Option ByStr20 = None {ByStr20}
  field dmz_addr : ByStr20 = dmzContract
  field dmzAvailable : Uint128 = Uint128 0
  field dmzLastAmount : Uint128 = Uint128 0

  (*Add stakers*)
  field pendingAddStake : Map ByStr20 (Pair (ByStr20) (Uint128)) = Emp ByStr20 (Pair (ByStr20) (Uint128))
  field stakers : Map ByStr20 Uint128 = Emp ByStr20 Uint128
  field removeStaker: Map ByStr20 Uint128 = Emp ByStr20 Uint128
  field removeBlock : Map ByStr20 BNum = Emp ByStr20 BNum
  field totalStaked : Uint128 = Uint128 0
  field totalStakers : Uint128 = Uint128 0
  field minimumStake : Uint128 = Uint128 5000000000

  (*Cycle related*)
  field cycleCount : Map ByStr20 Int32 = Emp ByStr20 Int32
  field cycleAmount : Map ByStr20 Uint128 = Emp ByStr20 Uint128
  field tierCycle : Map ByStr20 Uint128 = Emp ByStr20 Uint128

  field rewardCount : Int32 = Int32 10
  field rewardRate : Uint128 = Uint128 1

  field futureContract : ByStr20 = _this_address
  field implementationContract : ByStr20 = _this_address

  field automaticCul : Map ByStr20 Bool = Emp ByStr20 Bool
  field pending_dmz : Map ByStr20 Uint128 = Emp ByStr20 Uint128

  field whitelistAddr : Map ByStr20 ByStr20 = Emp ByStr20 ByStr20
  field useWhitelist : Bool = True

  (*Unstake related*)
  field unstakePercent : Uint128 = Uint128 7
  field rewardPercent : Uint128 = Uint128 15
  field remove_bnum : Uint64 = Uint64 16000
  field penalty : Uint128 = Uint128 10
  field burntAmount : Uint128 = Uint128 0
  field daily : Bool = True
  field unstakeDays : Uint128 = Uint128 10
  field penaltyRewardPerStaker : Uint128 = Uint128 0
  field totalUnstaked : Uint128 = Uint128 0
  field autoFee : Uint128 = Uint128 0
  field burnAddress : ByStr20 = initial_owner

  (*Contract Related*)
  field pauseStake : Bool = True
  field rewardBlocks : BNum = BNum 0
  field lastReward : BNum = BNum 0
  field rewardTime : Uint128 = Uint128 1700
```
