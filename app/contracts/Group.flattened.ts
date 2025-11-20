export const GROUP_SOURCE_CODE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

// src/errors/ArisanErrors.sol

/// @title ArisanErrors
/// @notice Custom errors for Arisan protocol
library ArisanErrors {
    // ========== Access Control Errors ==========
    
    /// @notice Caller is not the coordinator
    error NotCoordinator();
    
    /// @notice Caller is not a member of the group
    error NotMember();
    
    /// @notice Caller is not an active voter
    error NotActiveVoter();
    
    // ========== Validation Errors ==========
    
    /// @notice Invalid input parameters provided
    error InvalidParameters();
    
    /// @notice Title is empty
    error EmptyTitle();
    
    /// @notice Telegram group URL is empty
    error EmptyTelegramUrl();
    
    /// @notice Coordinator telegram username is empty
    error EmptyCoordinatorUsername();
    
    /// @notice Contribution amount must be greater than zero
    error InvalidContributionAmount();
    
    /// @notice Commission percentage is too high
    // error CommissionPercentageTooHigh();
    // replaced below
    
    /// @notice Prize percentage is too high
    error PrizePercentageTooHigh();
    
    /// @notice Sum of commission and prize exceeds 100%
    error PercentagesSumExceeds100();
    
    /// @notice Coordinator cannot leave the group
    error CoordinatorCannotLeave();
    
    // ========== Period Errors ==========
    
    /// @notice Tried to start period when last period hasn't ended
    error LastPeriodNotEnded();
    
    /// @notice Tried to access period that doesn't exist
    error PeriodDoesNotExist();
    
    /// @notice Period is no longer ongoing
    error PeriodEnded();
    
    /// @notice Participant already contributed for this round
    error AlreadyContributedThisRound();
    
    /// @notice Contribution amount is incorrect
    error IncorrectContributionAmount();
    
    /// @notice Cannot draw winner yet, not all participants have contributed
    error IncompleteRound();
    
    /// @notice All participants have already won this period
    error NoDueWinnersRemaining();
    
    /// @notice No period is currently ongoing
    error NoPeriodOngoing();
    
    /// @notice Participant is still participating in ongoing period
    error StillParticipatingInPeriod();
    
    /// @notice Participant hasn't participated in required round
    error DidNotParticipateInPreviousRound();
    
    // ========== Proposal Errors ==========
    
    /// @notice Proposal does not exist
    error ProposalDoesNotExist();
    
    /// @notice Proposal has already been completed
    error ProposalAlreadyCompleted();
    
    /// @notice Caller has already voted on this proposal
    error AlreadyVotedOnProposal();
    
    /// @notice Proposal category mismatch
    error InvalidProposalCategory();
    
    /// @notice Cannot have incomplete proposals when ending period
    error IncompleteProposalsRemaining();
    
    /// @notice Cannot join while waiting for previous join approval
    error AlreadyWaitingForJoinApproval();
    
    /// @notice Member already exists
    error MemberAlreadyExists();
    
    /// @notice Cannot leave without ending period participation
    error CannotLeaveWhileParticipating();
    
    // ========== Finance Errors ==========
    
    /// @notice Insufficient balance for transfer
    error InsufficientBalance();
    
    /// @notice Transfer failed
    error TransferFailed();
    
    /// @notice Recipient address is invalid
    error InvalidRecipient();
    
    /// @notice Amount is zero
    error AmountIsZero();
    
    // ========== Member Errors ==========
    
    /// @notice Member does not exist
    error MemberDoesNotExist();
    
    /// @notice Invalid member index
    error InvalidMemberIndex();

    // ========== Capacity Errors ==========

    /// @notice Group is at maximum capacity
    error GroupCapacityExceeded();

    /// @notice Insufficient funds for capacity upgrade
    error InsufficientCapacityUpgradeFunds();

    /// @notice Exact payment amount required for capacity upgrade
    error IncorrectCapacityUpgradePayment();

    /// @notice Cannot upgrade at current member count
    error CannotUpgradeAtCurrentMemberCount();

    // ========== Platform Fee & Commission Errors ==========

    /// @notice Coordinator commission is below minimum (5%)
    error CommissionTooLow();

    /// @notice Coordinator commission exceeds maximum (50%)
    error CommissionPercentageTooHigh();

    // ========== Join Mechanism Errors ==========

    /// @notice Member cannot propose themselves
    error CannotProposeSelf();

    /// @notice Join mechanism is not open (no approval-less join)
    error JoinMechanismNotOpen();
    
    // ========== Generic Errors ==========
    
    /// @notice Operation failed
    error OperationFailed();
}

// src/types/ArisanTypes.sol

/// @title ArisanTypes
/// @notice Shared types, enums, and structs for Arisan protocol

// ========== Enums ==========

/// @notice Status of a user's membership in a group
enum JoinStatus {
    Unknown,
    NotJoined,
    WaitingApproval,
    Joined
}

/// @notice Status of a member's vote on a proposal
enum ApprovalStatus {
    Unset,
    Approved,
    Rejected
}

/// @notice Category of a governance proposal
enum ProposalCategory {
    Title,
    TelegramGroupUrl,
    ContributionAmount,
    PrizePercentage,
    CoordinatorCommissionPercentage,
    Coordinator,
    NewMember,
    Transfer
}

// ========== Data Structs ==========

/// @notice Internal representation of a group member
struct Member {
    string telegramUsername;
    bool isActiveVoter;
    uint256 latestPeriodParticipation;
}

/// @notice External representation of a member (for return values)
struct ExternalMember {
    address walletAddress;
    string telegramUsername;
    bool isActiveVoter;
    uint256 latestPeriodParticipation;
}

/// @notice A single round within a period
struct Round {
    uint256 drawnAt;
    address winner;
    uint256 contributorCount;
}

/// @notice External representation of a round
struct ExternalRound {
    uint256 drawnAt;
    ExternalMember winner;
    uint256 contributorCount;
}

/// @notice Internal representation of an Arisan period
struct Period {
    uint256 startedAt;
    uint256 endedAt;
    uint256 remainingPeriodBalanceInWei;
    uint256 contributionAmountInWei;
    uint256 coordinatorCommissionPercentage;
    uint256 prizePercentage;
    address[] participants;
    Round[] rounds;
    address[] dueWinners;
}

/// @notice External representation of a period (for return values)
struct ExternalPeriod {
    uint256 startedAt;
    uint256 endedAt;
    uint256 remainingPeriodBalanceInWei;
    uint256 contributionAmountInWei;
    uint256 coordinatorCommissionPercentage;
    uint256 prizePercentage;
    uint256 roundsCount;
    uint256 dueWinnersCount;
}

/// @notice Internal representation of a governance proposal
struct Proposal {
    ProposalCategory category;
    uint256 proposedAt;
    address proposer;
    uint256 completedAt;
    bool isApproved;
    address[] approvers;
}

/// @notice External representation of a proposal (for return values)
struct ExternalProposal {
    uint256 index;
    ProposalCategory category;
    uint256 proposedAt;
    ExternalMember proposer;
    uint256 completedAt;
    bool isApproved;
    uint256 approversCount;
    string stringProposalValue;
    uint256 uintProposalValue;
    ExternalMember coordinatorProposalValue;
    NewMemberProposalValue newMemberProposalValue;
    TransferProposalValue transferProposalValue;
}

/// @notice Configuration details for a new member proposal
struct NewMemberProposalValue {
    address memberAddress;
    string telegramUsername;
}

/// @notice Configuration details for a transfer proposal
struct TransferProposalValue {
    address payable recipient;
    uint256 transferAmount;
}

/// @notice Group information for external queries
struct GroupData {
    address groupAddress;
    string title;
    string telegramGroupUrl;
    uint256 membersCount;
    address[] memberAddresses;
    JoinStatus joinStatus;
}

/// @notice Group settings for external queries
struct GroupSettings {
    string title;
    string telegramGroupUrl;
    ExternalMember coordinator;
    uint256 coordinatorCommissionPercentage;
    uint256 contributionAmountInWei;
    uint256 prizePercentage;
    uint256 maxCapacity;
    uint256 capacityUpgradeCount;
    bool openJoinEnabled;
}

// src/libraries/ArisanCapacity.sol

/// @title ArisanCapacity
/// @notice Library for managing group capacity upgrades with incremental payments
/// @dev Handles infinite expansion after 200 mark with 200-unit increments
library ArisanCapacity {
    // ========== Constants ==========
    
    /// @notice Initial group capacity
    uint256 public constant INITIAL_CAPACITY = 10;
    
    /// @notice First upgrade target
    uint256 public constant FIRST_TIER = 50;
    
    /// @notice Second upgrade target
    uint256 public constant SECOND_TIER = 100;
    
    /// @notice Third upgrade target and beginning of unlimited tiers
    uint256 public constant THIRD_TIER = 200;
    
    /// @notice Increment size for capacities above THIRD_TIER
    uint256 public constant UNLIMITED_INCREMENT = 200;
    
    // ========== Types ==========
    
    /// @notice Capacity management state
    struct CapacityState {
        uint256 currentCapacity;
        uint256 upgradeCount;
    }
    
    // ========== View Functions ==========
    
    /// @notice Get available member slots
    /// @param state The capacity state
    /// @param currentMemberCount Current number of members
    /// @return Number of available slots
    function getAvailableCapacity(
        CapacityState storage state,
        uint256 currentMemberCount
    ) internal view returns (uint256) {
        if (currentMemberCount >= state.currentCapacity) {
            return 0;
        }
        return state.currentCapacity - currentMemberCount;
    }
    
    /// @notice Calculate next capacity tier after upgrade
    /// @param currentCapacity Current capacity limit
    /// @return Next capacity tier
    function getNextCapacity(uint256 currentCapacity) internal pure returns (uint256) {
        if (currentCapacity == INITIAL_CAPACITY) {
            return FIRST_TIER;
        } else if (currentCapacity == FIRST_TIER) {
            return SECOND_TIER;
        } else if (currentCapacity == SECOND_TIER) {
            return THIRD_TIER;
        } else if (currentCapacity >= THIRD_TIER) {
            // Infinite expansion: add INCREMENT to current capacity
            return currentCapacity + UNLIMITED_INCREMENT;
        }
        
        revert ArisanErrors.InvalidParameters();
    }
    
    /// @notice Check if current capacity can be upgraded
    /// @param currentCapacity Current capacity
    /// @param currentMemberCount Current member count
    /// @return True if upgrade is possible
    function canUpgrade(uint256 currentCapacity, uint256 currentMemberCount) 
        internal 
        pure 
        returns (bool) 
    {
        // Cannot upgrade if already at or above member count
        uint256 nextCapacity = getNextCapacity(currentCapacity);
        return currentMemberCount < nextCapacity;
    }
    
    // ========== State Modification ==========
    
    /// @notice Perform capacity upgrade
    /// @param state The capacity state
    /// @param currentMemberCount Current member count (for validation)
    function performUpgrade(CapacityState storage state, uint256 currentMemberCount) internal {
        require(canUpgrade(state.currentCapacity, currentMemberCount), "Cannot upgrade at current member count");
        
        state.currentCapacity = getNextCapacity(state.currentCapacity);
        state.upgradeCount += 1;
    }
    
    /// @notice Initialize capacity state
    /// @param state The capacity state
    function initialize(CapacityState storage state) internal {
        state.currentCapacity = INITIAL_CAPACITY;
        state.upgradeCount = 0;
    }
}

// src/libraries/ArisanPlatformFee.sol

/// @title ArisanPlatformFee
/// @notice Library for managing platform fee collection on coordinator commissions
/// @dev Hardcoded, immutable platform fee ensures transparency and fairness
library ArisanPlatformFee {
    // ========== Constants ==========
    
    /// @notice Platform fee percentage (5% of coordinator commission)
    /// @dev Immutable and hardcoded - only changeable via new contract deployment
    uint256 public constant PLATFORM_FEE_PERCENTAGE = 5;
    
    /// @notice Percentage base for calculations
    uint256 private constant PERCENTAGE_BASE = 100;
    
    // ========== View Functions ==========
    
    /// @notice Calculate platform fee from coordinator commission
    /// @param coordinatorCommission Amount of coordinator commission
    /// @return Platform fee amount (5% of coordinator commission)
    function calculatePlatformFee(uint256 coordinatorCommission) 
        internal 
        pure 
        returns (uint256) 
    {
        return (coordinatorCommission * PLATFORM_FEE_PERCENTAGE) / PERCENTAGE_BASE;
    }
    
    /// @notice Calculate coordinator net payout after platform fee deduction
    /// @param coordinatorCommission Gross coordinator commission
    /// @return Net amount coordinator receives
    function calculateCoordinatorNetPayout(uint256 coordinatorCommission) 
        internal 
        pure 
        returns (uint256) 
    {
        uint256 platformFee = calculatePlatformFee(coordinatorCommission);
        return coordinatorCommission - platformFee;
    }
    
    /// @notice Validate coordinator commission constraints
    /// @param commissionPercentage Coordinator commission percentage
    function validateCoordinatorCommission(uint256 commissionPercentage) internal pure {
        if (commissionPercentage < 5) {
            revert ArisanErrors.CommissionTooLow();
        }
        if (commissionPercentage > 50) {
            revert ArisanErrors.CommissionPercentageTooHigh();
        }
    }
}

// src/interfaces/IGroup.sol

/// @title IGroup
/// @notice Interface for an Arisan group contract

interface IGroup {
    // ========== Events ==========

    /// @notice Emitted when a winner is drawn in a period
    event WinnerDrawn(ExternalMember indexed winner, uint256 indexed periodIndex, uint256 indexed roundIndex);

    /// @notice Emitted when a member joins the group
    event MemberJoined(address indexed member, string telegramUsername);

    /// @notice Emitted when a member leaves the group
    event MemberLeft(address indexed member);

    /// @notice Emitted when a period starts
    event PeriodStarted(uint256 indexed periodIndex, uint256 timestamp);

    /// @notice Emitted when a period ends
    event PeriodEnded(uint256 indexed periodIndex, uint256 timestamp);

    /// @notice Emitted when a proposal is created
    event ProposalCreated(uint256 indexed proposalIndex, ProposalCategory indexed category, address indexed proposer);

    /// @notice Emitted when a proposal is completed (approved or rejected)
    event ProposalCompleted(uint256 indexed proposalIndex, bool indexed isApproved);

    /// @notice Emitted when a transfer is executed
    event TransferExecuted(address indexed recipient, uint256 amount);

    // ========== View Functions ==========

    /// @notice Get group title
    function title() external view returns (string memory);

    /// @notice Get telegram group URL
    function telegramGroupUrl() external view returns (string memory);

    /// @notice Get coordinator address
    function coordinator() external view returns (address);

    /// @notice Get coordinator commission percentage
    function coordinatorCommissionPercentage() external view returns (uint256);

    /// @notice Get contribution amount in wei
    function contributionAmountInWei() external view returns (uint256);

    /// @notice Get prize percentage
    function prizePercentage() external view returns (uint256);

    /// @notice Get Member by Address
    function getMemberByAddress(address memberAddress) external view returns (ExternalMember memory);

    /// @notice Check if someone is a member
    function isMember(address person) external view returns (bool);

    /// @notice Get Current Period Status
    function getCurrentPeriod() external view returns (ExternalPeriod memory, bool onGoing);

    /// @notice get all due winner in current periods
    function getCurrentPeriodDueWinners() external view returns (address[] memory);

    /// @notice get proposal by index (incomplete or complete)
    function getProposalByIndex(uint256 index) external view returns (ExternalProposal memory);

    /// @notice check if someone has voted on a proposal
    function hasVotedOnProposal(uint256 proposalIndex, address voter) external view returns (bool);

    /// @notice Get number of active voters
    function getActiveVotersCount() external view returns (uint256);

    /// @notice Get member address by index
    function getMemberByIndex(uint256 index) external view returns (ExternalMember memory);

    /// @notice Get total members count
    function getMembersCount() external view returns (uint256);

    /// @notice Get group details
    function getGroupDetail() external view returns (GroupData memory);

    /// @notice Get group settings
    function getGroupSettings() external view returns (GroupSettings memory);

    /// @notice Get period by index
    function getPeriodByIndex(uint256 index) external view returns (ExternalPeriod memory);

    /// @notice Get total periods count
    function getPeriodsCount() external view returns (uint256);

    /// @notice Get round details
    function getRoundByIndexAndPeriodIndex(
        uint256 roundIndex,
        uint256 periodIndex
    ) external view returns (ExternalRound memory);

    /// @notice Get due winner by index and period index
    function getDueWinnerByIndexAndPeriodIndex(
        uint256 winnerIndex,
        uint256 periodIndex
    ) external view returns (ExternalMember memory);

    /// @notice Get incomplete proposals count
    function getIncompleteProposalsCount() external view returns (uint256);

    /// @notice Get incomplete proposal by index
    function getIncompleteProposalByIndex(uint256 index) external view returns (ExternalProposal memory);

    /// @notice Get approver by index and proposal index
    function getApproverByIndexAndProposalIndex(
        uint256 approverIndex,
        uint256 proposalIndex
    ) external view returns (ExternalMember memory);

    // ========== Member Management ==========

    /// @notice Propose a new member to join the group
    /// @param memberAddress Address of the new member
    /// @param telegramUsername Telegram username of the new member
    function proposeNewMember(address memberAddress, string calldata telegramUsername) external;

    /// @notice Approve a new member proposal
    /// @param proposalIndex Index of the proposal
    function approveNewMemberProposal(uint256 proposalIndex) external;

    /// @notice Reject a new member proposal
    /// @param proposalIndex Index of the proposal
    function rejectNewMemberProposal(uint256 proposalIndex) external;

    /// @notice Leave the group (not applicable for coordinator)
    function leave() external;

    // ========== Period Management ==========

    /// @notice Start a new period (coordinator only)
    function startPeriod() external payable;

    /// @notice Contribute to the current period
    /// @param periodIndex Index of the period
    function contribute(uint256 periodIndex) external payable;

    /// @notice Draw a winner for the current round (coordinator only)
    /// @param periodIndex Index of the period
    function drawWinner(uint256 periodIndex) external;

    // ========== Governance: Title Proposals ==========

    /// @notice Propose a new group title
    /// @param newValue The new title
    function proposeNewTitle(string calldata newValue) external;

    /// @notice Approve a title change proposal
    /// @param proposalIndex Index of the proposal
    function approveNewTitleProposal(uint256 proposalIndex) external;

    /// @notice Reject a title change proposal
    /// @param proposalIndex Index of the proposal
    function rejectStringProposal(uint256 proposalIndex) external;

    // ========== Governance: Telegram URL Proposals ==========

    /// @notice Propose a new telegram group URL
    /// @param newValue The new URL
    function proposeNewTelegramGroupUrl(string calldata newValue) external;

    /// @notice Approve a telegram URL change proposal
    /// @param proposalIndex Index of the proposal
    function approveNewTelegramGroupUrlProposal(uint256 proposalIndex) external;

    // ========== Governance: Contribution Amount Proposals ==========

    /// @notice Propose a new contribution amount
    /// @param newContributionAmountInWei The new contribution amount
    function proposeNewContributionAmountInWei(uint256 newContributionAmountInWei) external;

    /// @notice Approve a contribution amount change proposal
    /// @param proposalIndex Index of the proposal
    function approveContributionAmountProposal(uint256 proposalIndex) external;

    /// @notice Reject a contribution amount proposal
    /// @param proposalIndex Index of the proposal
    function rejectUintProposal(uint256 proposalIndex) external;

    // ========== Governance: Prize Percentage Proposals ==========

    /// @notice Propose a new prize percentage
    /// @param newPrizePercentage The new prize percentage
    function proposeNewPrizePercentage(uint256 newPrizePercentage) external;

    /// @notice Approve a prize percentage change proposal
    /// @param proposalIndex Index of the proposal
    function approvePrizePercentageProposal(uint256 proposalIndex) external;

    // ========== Governance: Coordinator Commission Proposals ==========

    /// @notice Propose a new coordinator commission percentage
    /// @param newCoordinatorCommissionPercentage The new commission percentage
    function proposeNewCoordinatorCommissionPercentage(
        uint256 newCoordinatorCommissionPercentage
    ) external;

    /// @notice Approve a coordinator commission change proposal
    /// @param proposalIndex Index of the proposal
    function approveNewCoordinatorCommissionPercentageProposal(uint256 proposalIndex) external;

    // ========== Governance: Coordinator Proposals ==========

    /// @notice Propose a new coordinator
    /// @param newCoordinator Address of the new coordinator
    function proposeNewCoordinator(address newCoordinator) external;

    /// @notice Approve a new coordinator proposal
    /// @param proposalIndex Index of the proposal
    function approveNewCoordinatorProposal(uint256 proposalIndex) external;

    /// @notice Reject a new coordinator proposal
    /// @param proposalIndex Index of the proposal
    function rejectNewCoordinatorProposal(uint256 proposalIndex) external;

    // ========== Governance: Transfer Proposals ==========

    /// @notice Propose a transfer of funds
    /// @param recipient Address to receive the funds
    /// @param transferAmount Amount to transfer
    function proposeTransfer(address recipient, uint256 transferAmount) external;

    /// @notice Approve a transfer proposal
    /// @param proposalIndex Index of the proposal
    function approveTransferProposal(uint256 proposalIndex) external;

    /// @notice Reject a transfer proposal
    /// @param proposalIndex Index of the proposal
    function rejectTransferProposal(uint256 proposalIndex) external;

    // ========== Capacity Upgrade & Signatures ==========
    /// @notice Emitted when group capacity is upgraded
    event CapacityUpgraded(
        uint256 indexed previousCapacity,
        uint256 indexed newCapacity,
        uint256 indexed upgradeCost
    );

    function upgradeCapacity() external payable;
    function getMaxCapacity() external view returns (uint256);
    function getAvailableCapacity() external view returns (uint256);
    function getCapacityUpgradeCount() external view returns (uint256);
    function getNextCapacityTier() external view returns (uint256);

    // ========== New Join Functions ==========

    /// @notice Request to join with member approval (requires 50% vote)
    function joinGroup(string calldata telegramUsername) external;

    /// @notice Join directly without approval (if enabled by coordinator)
    function joinGroupNoApproval(string calldata telegramUsername) external;

    /// @notice Toggle open join setting
    function toggleOpenJoin(bool enabled) external;

    /// @notice Check if open join is enabled
    function isOpenJoinEnabled() external view returns (bool);

    // ========== New Events ==========

    /// @notice Emitted when a member requests to join (approval-based)
    event JoinRequested(address indexed applicant, string telegramUsername);

    /// @notice Emitted when join request is approved
    event JoinApproved(address indexed applicant);

    /// @notice Emitted when join request is rejected
    event JoinRejected(address indexed applicant);

    /// @notice Emitted when open join setting changes
    event OpenJoinToggled(bool enabled);

}

// src/libraries/ArisanFinance.sol

/// @title ArisanFinance
/// @notice Library for financial calculations and transfers

library ArisanFinance {
    // ========== Constants ==========

    uint256 private constant PERCENTAGE_BASE = 100;
    uint256 private constant MAX_PERCENTAGE = 100;

    // ========== View Functions ==========

    /// @notice Calculate prize amount for a winner
    /// @param totalContributions Total contributions in the round
    /// @param prizePercentage Prize percentage
    /// @return Prize amount in wei
    function calculatePrize(uint256 totalContributions, uint256 prizePercentage)
        internal
        pure
        returns (uint256)
    {
        return (totalContributions * prizePercentage) / PERCENTAGE_BASE;
    }

    /// @notice Calculate coordinator commission
    /// @param totalContributions Total contributions in the round
    /// @param commissionPercentage Commission percentage
    /// @return Commission amount in wei
    function calculateCommission(uint256 totalContributions, uint256 commissionPercentage)
        internal
        pure
        returns (uint256)
    {
        return (totalContributions * commissionPercentage) / PERCENTAGE_BASE;
    }

    /// @notice Calculate total payout (prize + commission)
    /// @param totalContributions Total contributions in the round
    /// @param prizePercentage Prize percentage
    /// @param commissionPercentage Commission percentage
    /// @return Total payout amount
    function calculateTotalPayout(
        uint256 totalContributions,
        uint256 prizePercentage,
        uint256 commissionPercentage
    ) internal pure returns (uint256) {
        return calculatePrize(totalContributions, prizePercentage)
            + calculateCommission(totalContributions, commissionPercentage);
    }

    /// @notice Validate percentages
    /// @param prizePercentage Prize percentage
    /// @param commissionPercentage Commission percentage
    function validatePercentages(uint256 prizePercentage, uint256 commissionPercentage)
        internal
        pure
    {
        if (prizePercentage > MAX_PERCENTAGE) revert ArisanErrors.PrizePercentageTooHigh();
        if (commissionPercentage > MAX_PERCENTAGE) revert ArisanErrors.CommissionPercentageTooHigh();
        if (prizePercentage + commissionPercentage > MAX_PERCENTAGE) {
            revert ArisanErrors.PercentagesSumExceeds100();
        }
    }

    /// @notice Check if sufficient balance is available for transfer
    /// @param currentBalance Current contract balance
    /// @param lockedBalance Balance locked in ongoing period
    /// @param requestedAmount Amount requested to transfer
    /// @return True if sufficient balance available
    function hasSufficientBalance(
        uint256 currentBalance,
        uint256 lockedBalance,
        uint256 requestedAmount
    ) internal pure returns (bool) {
        return currentBalance >= lockedBalance + requestedAmount;
    }

    /// @notice Calculate available balance for transfers
    /// @param currentBalance Current contract balance
    /// @param lockedBalance Balance locked in ongoing period
    /// @return Available balance
    function getAvailableBalance(uint256 currentBalance, uint256 lockedBalance)
        internal
        pure
        returns (uint256)
    {
        if (currentBalance <= lockedBalance) {
            return 0;
        }
        return currentBalance - lockedBalance;
    }

    /// @notice Calculate contribution amount for a participant
    /// @param baseContributionAmount Base contribution amount
    /// @param roundsSinceLast Number of rounds since last contribution
    /// @return Total contribution amount due
    function calculateContributionAmount(uint256 baseContributionAmount, uint256 roundsSinceLast)
        internal
        pure
        returns (uint256)
    {
        if (roundsSinceLast == 0) return 0;
        return baseContributionAmount * roundsSinceLast;
    }

    // ========== Transfer Functions ==========

    /// @notice Transfer ETH to a recipient
    /// @param recipient Address to receive the funds
    /// @param amount Amount to transfer
    function transfer(address payable recipient, uint256 amount) internal {
        if (recipient == address(0)) revert ArisanErrors.InvalidRecipient();
        if (amount == 0) revert ArisanErrors.AmountIsZero();

        (bool success,) = recipient.call{value: amount}("");
        if (!success) revert ArisanErrors.TransferFailed();
    }

    /// @notice Batch transfer to multiple recipients
    /// @param recipients Array of recipient addresses
    /// @param amounts Array of amounts to transfer
    function batchTransfer(address payable[] calldata recipients, uint256[] calldata amounts)
        internal
    {
        if (recipients.length != amounts.length) revert ArisanErrors.InvalidParameters();
        if (recipients.length == 0) revert ArisanErrors.InvalidParameters();

        for (uint256 i = 0; i < recipients.length; i++) {
            transfer(recipients[i], amounts[i]);
        }
    }

    /// @notice Split coordinator commission into net payout and platform fee
    /// @param coordinatorCommission Gross commission amount
    /// @return netPayout Coordinator net payout (after platform fee)
    /// @return platformFee Fee amount for platform wallet
    function splitCoordinatorCommission(uint256 coordinatorCommission) 
        internal 
        pure 
        returns (uint256 netPayout, uint256 platformFee) 
    {
        platformFee = ArisanPlatformFee.calculatePlatformFee(coordinatorCommission);
        netPayout = coordinatorCommission - platformFee;
    }

    /// @notice Validate coordinator commission percentage
    /// @param commissionPercentage Commission percentage to validate
    function validateCoordinatorCommission(uint256 commissionPercentage) internal pure {
        ArisanPlatformFee.validateCoordinatorCommission(commissionPercentage);
    }
}

// src/libraries/ArisanProposals.sol

/// @title ArisanProposals
/// @notice Library for managing governance proposals

library ArisanProposals {
    // ========== Types ==========

    /// @notice Proposal management state
    struct ProposalsState {
        Proposal[] proposals;
        mapping(uint256 => bool) incompleteProposals;
        mapping(uint256 => mapping(address => ApprovalStatus)) proposalApprovals;
    }

    // ========== View Functions ==========

    /// @notice Get total proposals count
    /// @param state The proposals state
    /// @return Number of proposals
    function getProposalsCount(ProposalsState storage state) internal view returns (uint256) {
        return state.proposals.length;
    }

    /// @notice Check if proposal exists
    /// @param state The proposals state
    /// @param proposalIndex Index of the proposal
    /// @return True if the proposal exists
    function proposalExists(ProposalsState storage state, uint256 proposalIndex)
        internal
        view
        returns (bool)
    {
        return proposalIndex < state.proposals.length;
    }

    /// @notice Check if proposal is incomplete
    /// @param state The proposals state
    /// @param proposalIndex Index of the proposal
    /// @return True if the proposal is incomplete
    function isIncompleteProposal(ProposalsState storage state, uint256 proposalIndex)
        internal
        view
        returns (bool)
    {
        return proposalExists(state, proposalIndex) && state.incompleteProposals[proposalIndex];
    }

    /// @notice Get incomplete proposals count
    /// @param state The proposals state
    /// @return Count of incomplete proposals
    function getIncompleteProposalsCount(ProposalsState storage state)
        internal
        view
        returns (uint256)
    {
        uint256 count = 0;
        for (uint256 i = 0; i < state.proposals.length; i++) {
            if (state.incompleteProposals[i]) {
                count++;
            }
        }
        return count;
    }

    /// @notice Check if a voter has already voted on a proposal
    /// @param state The proposals state
    /// @param proposalIndex Index of the proposal
    /// @param voter Address of the voter
    /// @return True if they have voted
    function hasVoted(ProposalsState storage state, uint256 proposalIndex, address voter)
        internal
        view
        returns (bool)
    {
        return state.proposalApprovals[proposalIndex][voter] != ApprovalStatus.Unset;
    }

    /// @notice Get proposal by index
    /// @param state The proposals state
    /// @param proposalIndex Index of the proposal
    /// @return Proposal storage reference
    function getProposal(ProposalsState storage state, uint256 proposalIndex)
        internal
        view
        returns (Proposal storage)
    {
        if (!proposalExists(state, proposalIndex)) revert ArisanErrors.ProposalDoesNotExist();
        return state.proposals[proposalIndex];
    }

    /// @notice Get proposal approvers
    /// @param state The proposals state
    /// @param proposalIndex Index of the proposal
    /// @return Array of approver addresses
    function getApprovers(ProposalsState storage state, uint256 proposalIndex)
        internal
        view
        returns (address[] memory)
    {
        if (!proposalExists(state, proposalIndex)) revert ArisanErrors.ProposalDoesNotExist();
        return state.proposals[proposalIndex].approvers;
    }

    /// @notice Get approvers count
    /// @param state The proposals state
    /// @param proposalIndex Index of the proposal
    /// @return Number of approvers
    function getApproversCount(ProposalsState storage state, uint256 proposalIndex)
        internal
        view
        returns (uint256)
    {
        if (!proposalExists(state, proposalIndex)) revert ArisanErrors.ProposalDoesNotExist();
        return state.proposals[proposalIndex].approvers.length;
    }

    /// @notice Get approver by index
    /// @param state The proposals state
    /// @param proposalIndex Index of the proposal
    /// @param approverIndex Index in the approvers array
    /// @return Address of the approver
    function getApproverByIndex(
        ProposalsState storage state,
        uint256 proposalIndex,
        uint256 approverIndex
    ) internal view returns (address) {
        if (!proposalExists(state, proposalIndex)) revert ArisanErrors.ProposalDoesNotExist();
        if (approverIndex >= state.proposals[proposalIndex].approvers.length)
            revert ArisanErrors.ProposalDoesNotExist();
        return state.proposals[proposalIndex].approvers[approverIndex];
    }

    // ========== Modification Functions ==========

    /// @notice Create a new proposal
    /// @param state The proposals state
    /// @param category Category of the proposal
    /// @param proposer Address of the proposer
    /// @return proposalIndex Index of the new proposal
    function createProposal(
        ProposalsState storage state,
        ProposalCategory category,
        address proposer
    ) internal returns (uint256) {
        uint256 proposalIndex = state.proposals.length;
        
        state.proposals.push(
            Proposal({
                category: category,
                proposedAt: block.timestamp,
                proposer: proposer,
                completedAt: 0,
                isApproved: false,
                approvers: new address[](0)
            })
        );
        state.incompleteProposals[proposalIndex] = true;
        return proposalIndex;
    }

    /// @notice Record a vote on a proposal
    /// @param state The proposals state
    /// @param proposalIndex Index of the proposal
    /// @param voter Address of the voter
    /// @param approve True if approving, false if rejecting
    /// @return isNowApproved True if proposal was just approved by this vote
    function recordVote(
        ProposalsState storage state,
        uint256 proposalIndex,
        address voter,
        bool approve,
        uint256 requiredApprovals
    ) internal returns (bool isNowApproved) {
        if (!proposalExists(state, proposalIndex)) revert ArisanErrors.ProposalDoesNotExist();
        if (state.proposals[proposalIndex].completedAt != 0)
            revert ArisanErrors.ProposalAlreadyCompleted();
        if (hasVoted(state, proposalIndex, voter)) revert ArisanErrors.AlreadyVotedOnProposal();

        Proposal storage proposal = state.proposals[proposalIndex];

        if (approve) {
            state.proposalApprovals[proposalIndex][voter] = ApprovalStatus.Approved;
            proposal.approvers.push(voter);

            // Check if proposal is now approved
            if (proposal.approvers.length >= requiredApprovals) {
                proposal.isApproved = true;
                proposal.completedAt = block.timestamp;
                state.incompleteProposals[proposalIndex] = false;
                return true;
            }
        } else {
            state.proposalApprovals[proposalIndex][voter] = ApprovalStatus.Rejected;
            proposal.completedAt = block.timestamp;
            state.incompleteProposals[proposalIndex] = false;
        }

        return false;
    }

    /// @notice Mark a proposal as completed and rejected
    /// @param state The proposals state
    /// @param proposalIndex Index of the proposal
    function rejectProposal(ProposalsState storage state, uint256 proposalIndex) internal {
        if (!proposalExists(state, proposalIndex)) revert ArisanErrors.ProposalDoesNotExist();
        if (state.proposals[proposalIndex].completedAt != 0)
            revert ArisanErrors.ProposalAlreadyCompleted();

        state.proposals[proposalIndex].completedAt = block.timestamp;
        state.incompleteProposals[proposalIndex] = false;
    }

    /// @notice Clean up proposal data mappings
    /// @param state The proposals state
    /// @param proposalIndex Index of the proposal
    /// @dev Called after proposal completion to free storage
    function cleanupProposal(ProposalsState storage state, uint256 proposalIndex) internal view {
        if (!proposalExists(state, proposalIndex)) revert ArisanErrors.ProposalDoesNotExist();
        // Data remains but marked as incomplete = false
        // External cleanup of proposal-specific mappings should be done in main contract
    }
}

// src/libraries/ArisanMembers.sol

/// @title ArisanMembers
/// @notice Library for managing group members and their voting rights

library ArisanMembers {
    // ========== Types ==========

    /// @notice Member management state
    struct MembersState {
        address[] memberAddresses;
        mapping(address => uint256) memberIndices; // index + 1 (0 = not a member)
        mapping(address => Member) members;
        uint256 activeVotersCount;
        ArisanCapacity.CapacityState capacityState;
    }

    // ========== Constants ==========

    /// @notice Offset used in memberIndices mapping (0 means not a member)
    uint256 private constant INDEX_OFFSET = 1;

    // ========== View Functions ==========

    /// @notice Check if an address is a member of the group
    /// @param state The members state
    /// @param account Address to check
    /// @return True if the address is a member
    function isMember(MembersState storage state, address account) internal view returns (bool) {
        return state.memberIndices[account] > 0;
    }

    /// @notice Check if a member is an active voter
    /// @param state The members state
    /// @param account Member address
    /// @return True if the member is an active voter
    function isActiveVoter(MembersState storage state, address account) internal view returns (bool) {
        if (!isMember(state, account)) return false;
        return state.members[account].isActiveVoter;
    }

    /// @notice Get total number of members
    /// @param state The members state
    /// @return Number of members
    function getMembersCount(MembersState storage state) internal view returns (uint256) {
        return state.memberAddresses.length;
    }

    /// @notice Get active voters count
    /// @param state The members state
    /// @return Number of active voters
    function getActiveVotersCount(MembersState storage state) internal view returns (uint256) {
        return state.activeVotersCount;
    }

    /// @notice Get member by address
    /// @param state The members state
    /// @param account Member address
    /// @return The member details
    function getMemberByAddress(MembersState storage state, address account)
        internal
        view
        returns (Member storage)
    {
        if (!isMember(state, account)) revert ArisanErrors.NotMember();
        return state.members[account];
    }

    /// @notice Get member by index in the members array
    /// @param state The members state
    /// @param index Index in members array
    /// @return memberAddress Address of the member
    /// @return member The member details
    function getMemberByIndex(MembersState storage state, uint256 index)
        internal
        view
        returns (address memberAddress, Member storage member)
    {
        if (index >= state.memberAddresses.length) revert ArisanErrors.InvalidMemberIndex();
        memberAddress = state.memberAddresses[index];
        member = state.members[memberAddress];
    }

    /// @notice Get all member addresses
    /// @param state The members state
    /// @return Array of member addresses
    function getAllMemberAddresses(MembersState storage state)
        internal
        view
        returns (address[] memory)
    {
        return state.memberAddresses;
    }

    /// @notice Get current group capacity limit
    function getMaxCapacity(MembersState storage state) internal view returns (uint256) {
        return state.capacityState.currentCapacity;
    }

    /// @notice Get available member slots
    function getAvailableCapacity(MembersState storage state) internal view returns (uint256) {
        return ArisanCapacity.getAvailableCapacity(state.capacityState, state.memberAddresses.length);
    }

    /// @notice Convert member to external representation
    /// @param member The member struct
    /// @param walletAddress The wallet address
    /// @return External member representation
    function toExternal(address walletAddress, Member storage member)
        internal
        view
        returns (ExternalMember memory)
    {
        return ExternalMember({
            walletAddress: walletAddress,
            telegramUsername: member.telegramUsername,
            isActiveVoter: member.isActiveVoter,
            latestPeriodParticipation: member.latestPeriodParticipation
        });
    }

    // ========== Modification Functions ==========

    /// @notice Add a new member to the group
    /// @param state The members state
    /// @param memberAddress Address of the new member
    /// @param telegramUsername Telegram username
    /// @param shouldBeActiveVoter Whether the member should be an active voter
    function addMember(
        MembersState storage state,
        address memberAddress,
        string memory telegramUsername,
        bool shouldBeActiveVoter
    ) internal {
        if (isMember(state, memberAddress)) revert ArisanErrors.MemberAlreadyExists();
        if (bytes(telegramUsername).length == 0) revert ArisanErrors.EmptyCoordinatorUsername();

        if (state.memberAddresses.length >= state.capacityState.currentCapacity) {
            revert ArisanErrors.GroupCapacityExceeded();
        }

        state.memberAddresses.push(memberAddress);
        state.memberIndices[memberAddress] = state.memberAddresses.length;

        state.members[memberAddress] = Member({
            telegramUsername: telegramUsername,
            isActiveVoter: shouldBeActiveVoter,
            latestPeriodParticipation: 0
        });

        if (shouldBeActiveVoter) {
            state.activeVotersCount++;
        }
    }

    /// @notice Remove a member from the group (swap and pop strategy)
    /// @param state The members state
    /// @param memberAddress Address of the member to remove
    function removeMember(MembersState storage state, address memberAddress) internal {
        if (!isMember(state, memberAddress)) revert ArisanErrors.NotMember();

        // Get the index (subtract 1 because we store index + 1)
        uint256 indexToRemove = state.memberIndices[memberAddress] - INDEX_OFFSET;
        uint256 lastIndex = state.memberAddresses.length - 1;

        // If not the last member, swap with last member
        if (indexToRemove != lastIndex) {
            address lastAddress = state.memberAddresses[lastIndex];
            state.memberAddresses[indexToRemove] = lastAddress;
            state.memberIndices[lastAddress] = indexToRemove + INDEX_OFFSET;
        }

        // Remove last member
        state.memberAddresses.pop();

        // Deactivate voting if necessary
        if (state.members[memberAddress].isActiveVoter) {
            state.activeVotersCount--;
        }

        // Clean up mappings
        delete state.memberIndices[memberAddress];
        delete state.members[memberAddress];
    }

    /// @notice Set a member as active voter
    /// @param state The members state
    /// @param memberAddress Address of the member
    function setActiveVoter(MembersState storage state, address memberAddress) internal {
        if (!isMember(state, memberAddress)) revert ArisanErrors.NotMember();

        if (!state.members[memberAddress].isActiveVoter) {
            state.members[memberAddress].isActiveVoter = true;
            state.activeVotersCount++;
        }
    }

    /// @notice Set a member as inactive voter
    /// @param state The members state
    /// @param memberAddress Address of the member
    function setInactiveVoter(MembersState storage state, address memberAddress) internal {
        if (!isMember(state, memberAddress)) revert ArisanErrors.NotMember();

        if (state.members[memberAddress].isActiveVoter) {
            state.members[memberAddress].isActiveVoter = false;
            state.activeVotersCount--;
        }
    }

    /// @notice Update member's latest period participation
    /// @param state The members state
    /// @param memberAddress Address of the member
    /// @param periodIndex Index of the latest period they participated in
    function updateLatestPeriodParticipation(
        MembersState storage state,
        address memberAddress,
        uint256 periodIndex
    ) internal {
        if (!isMember(state, memberAddress)) revert ArisanErrors.NotMember();
        state.members[memberAddress].latestPeriodParticipation = periodIndex;
    }

    /// @notice Get Member Participation Status in period
    /// @param state The members state
    /// @param memberAddress Address of the member
    /// @param periodIndex Index of the latest period they participated in
    function getCurrentPeriodParticipationStatus(
        MembersState storage state,
        address memberAddress,
        uint256 periodIndex
    ) internal view returns (bool) {
        if (!isMember(state, memberAddress)) revert ArisanErrors.NotMember();
        return state.members[memberAddress].latestPeriodParticipation == periodIndex;
    }

    /// @notice Update member's telegram username
    /// @param state The members state
    /// @param memberAddress Address of the member
    /// @param newUsername New telegram username
    function updateTelegramUsername(
        MembersState storage state,
        address memberAddress,
        string memory newUsername
    ) internal {
        if (!isMember(state, memberAddress)) revert ArisanErrors.NotMember();
        if (bytes(newUsername).length == 0) revert ArisanErrors.EmptyCoordinatorUsername();
        state.members[memberAddress].telegramUsername = newUsername;
    }
}

// src/libraries/ArisanPeriods.sol

/// @title ArisanPeriods
/// @notice Library for managing Arisan periods and rounds

library ArisanPeriods {
    // ========== Types ==========

    /// @notice Period management state
    struct PeriodsState {
        Period[] periods;
        mapping(uint256 => mapping(address => uint256)) periodToParticipantContributionCount;
    }

    // ========== View Functions ==========

    /// @notice Get total number of periods
    /// @param state The periods state
    /// @return Number of periods
    function getPeriodsCount(PeriodsState storage state) internal view returns (uint256) {
        return state.periods.length;
    }

    /// @notice Check if a period exists
    /// @param state The periods state
    /// @param periodIndex Index of the period
    /// @return True if the period exists
    function periodExists(PeriodsState storage state, uint256 periodIndex)
        internal
        view
        returns (bool)
    {
        return periodIndex < state.periods.length;
    }

    /// @notice Check if a period is ongoing
    /// @param state The periods state
    /// @param periodIndex Index of the period
    /// @return True if the period is ongoing (hasn't ended)
    function isPeriodOngoing(PeriodsState storage state, uint256 periodIndex)
        internal
        view
        returns (bool)
    {
        if (!periodExists(state, periodIndex)) return false;
        return state.periods[periodIndex].endedAt == 0;
    }

    /// @notice Get the last period
    /// @param state The periods state
    /// @return Period storage reference
    function getLastPeriod(PeriodsState storage state) internal view returns (Period storage) {
        if (state.periods.length == 0) revert ArisanErrors.NoPeriodOngoing();
        return state.periods[state.periods.length - 1];
    }

    /// @notice Get the last round of a period
    /// @param state The periods state
    /// @param periodIndex Index of the period
    /// @return Round storage reference
    function getLastRound(PeriodsState storage state, uint256 periodIndex)
        internal
        view
        returns (Round storage)
    {
        if (!periodExists(state, periodIndex)) revert ArisanErrors.PeriodDoesNotExist();
        Period storage period = state.periods[periodIndex];
        if (period.rounds.length == 0) revert ArisanErrors.PeriodDoesNotExist();
        return period.rounds[period.rounds.length - 1];
    }

    /// @notice Get period by index
    /// @param state The periods state
    /// @param periodIndex Index of the period
    /// @return External period representation
    function getPeriodByIndex(PeriodsState storage state, uint256 periodIndex)
        internal
        view
        returns (ExternalPeriod memory)
    {
        if (!periodExists(state, periodIndex)) revert ArisanErrors.PeriodDoesNotExist();

        Period storage period = state.periods[periodIndex];
        return ExternalPeriod({
            startedAt: period.startedAt,
            endedAt: period.endedAt,
            remainingPeriodBalanceInWei: period.remainingPeriodBalanceInWei,
            contributionAmountInWei: period.contributionAmountInWei,
            coordinatorCommissionPercentage: period.coordinatorCommissionPercentage,
            prizePercentage: period.prizePercentage,
            roundsCount: period.rounds.length,
            dueWinnersCount: period.dueWinners.length
        });
    }

    /// @notice Get round by index
    /// @param state The periods state
    /// @param periodIndex Index of the period
    /// @param roundIndex Index of the round
    /// @return External round representation
    function getRoundByIndex(
        PeriodsState storage state,
        uint256 periodIndex,
        uint256 roundIndex,
        ArisanMembers.MembersState storage membersState
    ) internal view returns (ExternalRound memory) {
        if (!periodExists(state, periodIndex)) revert ArisanErrors.PeriodDoesNotExist();
        if (roundIndex >= state.periods[periodIndex].rounds.length)
            revert ArisanErrors.PeriodDoesNotExist();

        Round storage round = state.periods[periodIndex].rounds[roundIndex];
        return ExternalRound({
            drawnAt: round.drawnAt,
            winner: ArisanMembers.toExternal(round.winner, membersState.members[round.winner]),
            contributorCount: round.contributorCount
        });
    }

    /// @notice Get participant count for a period (snapshot at period start)
    /// @param state The periods state
    /// @param periodIndex Index of the period
    /// @return Number of expected participants
    function getParticipantCount(PeriodsState storage state, uint256 periodIndex)
        internal
        view
        returns (uint256)
    {
        if (!periodExists(state, periodIndex)) revert ArisanErrors.PeriodDoesNotExist();
        return state.periods[periodIndex].participants.length;
    }

    /// @notice Get participation count for a member in a period
    /// @param state The periods state
    /// @param periodIndex Index of the period
    /// @param participant Address of the participant
    /// @return Number of times they contributed
    function getParticipationCount(
        PeriodsState storage state,
        uint256 periodIndex,
        address participant
    ) internal view returns (uint256) {
        return state.periodToParticipantContributionCount[periodIndex][participant];
    }

    /// @notice Check if participant has participated in a period
    /// @param state The periods state
    /// @param periodIndex Index of the period
    /// @param participant Address of the participant
    /// @return True if they have participated
    function hasParticipated(
        PeriodsState storage state,
        uint256 periodIndex,
        address participant
    ) internal view returns (bool) {
        return state.periodToParticipantContributionCount[periodIndex][participant] > 0;
    }

    /// @notice Get all due winners for a period
    /// @param state The periods state
    /// @param periodIndex Index of the period
    /// @return Array of due winner addresses
    function getDueWinners(PeriodsState storage state, uint256 periodIndex)
        internal
        view
        returns (address[] memory)
    {
        if (!periodExists(state, periodIndex)) revert ArisanErrors.PeriodDoesNotExist();
        return state.periods[periodIndex].dueWinners;
    }

    /// @notice Get due winner by index
    /// @param state The periods state
    /// @param periodIndex Index of the period
    /// @param winnerIndex Index in dueWinners array
    /// @return Address of the due winner
    function getDueWinnerByIndex(
        PeriodsState storage state,
        uint256 periodIndex,
        uint256 winnerIndex
    ) internal view returns (address) {
        if (!periodExists(state, periodIndex)) revert ArisanErrors.PeriodDoesNotExist();
        if (winnerIndex >= state.periods[periodIndex].dueWinners.length)
            revert ArisanErrors.NoDueWinnersRemaining();
        return state.periods[periodIndex].dueWinners[winnerIndex];
    }

    /// @notice Count total contributors in a round
    /// @param state The periods state
    /// @param periodIndex Index of the period
    /// @param roundIndex Index of the round
    /// @return Number of contributors
    function getContributorCount(
        PeriodsState storage state,
        uint256 periodIndex,
        uint256 roundIndex
    ) internal view returns (uint256) {
        if (!periodExists(state, periodIndex)) revert ArisanErrors.PeriodDoesNotExist();
        if (roundIndex >= state.periods[periodIndex].rounds.length)
            revert ArisanErrors.PeriodDoesNotExist();
        return state.periods[periodIndex].rounds[roundIndex].contributorCount;
    }

    // ========== Modification Functions ==========

    /// @notice Create a new period
    /// @param state The periods state
    /// @param coordinatorCommissionPercentage Commission percentage
    /// @param contributionAmountInWei Contribution amount
    /// @param prizePercentage Prize percentage
    /// @return periodIndex Index of the new period
    function createPeriod(
        PeriodsState storage state,
        uint256 coordinatorCommissionPercentage,
        uint256 contributionAmountInWei,
        uint256 prizePercentage,
        address[] memory periodParticipants
    ) internal returns (uint256) {
        Period storage newPeriod = state.periods.push();
        newPeriod.startedAt = block.timestamp;
        newPeriod.contributionAmountInWei = contributionAmountInWei;
        newPeriod.coordinatorCommissionPercentage = coordinatorCommissionPercentage;
        newPeriod.prizePercentage = prizePercentage;
        newPeriod.participants = periodParticipants;
        newPeriod.dueWinners = periodParticipants;
        newPeriod.rounds.push(); // Create first round

        return state.periods.length - 1;
    }

    /// @notice End a period
    /// @param state The periods state
    /// @param periodIndex Index of the period
    function endPeriod(PeriodsState storage state, uint256 periodIndex) internal {
        if (!periodExists(state, periodIndex)) revert ArisanErrors.PeriodDoesNotExist();
        if (!isPeriodOngoing(state, periodIndex)) revert ArisanErrors.PeriodEnded();
        state.periods[periodIndex].endedAt = block.timestamp;
    }

    /// @notice Record a contribution from a participant
    /// @param state The periods state
    /// @param periodIndex Index of the period
    /// @param participant Address of the participant
    /// @param amount Amount contributed
    function recordContribution(
        PeriodsState storage state,
        uint256 periodIndex,
        address participant,
        uint256 amount
    ) internal {
        if (!periodExists(state, periodIndex)) revert ArisanErrors.PeriodDoesNotExist();

        Period storage period = state.periods[periodIndex];
        
        // Update participation count to match current round number
        state.periodToParticipantContributionCount[periodIndex][participant] = period.rounds.length;

        // Update balance and round contributor count
        period.remainingPeriodBalanceInWei += amount;
        period.rounds[period.rounds.length - 1].contributorCount++;
    }

    /// @notice Register a winner for a round
    /// @param state The periods state
    /// @param periodIndex Index of the period
    /// @param roundIndex Index of the round
    /// @param winner Address of the winner
    /// @param timestamp Timestamp when drawn
    function registerWinner(
        PeriodsState storage state,
        uint256 periodIndex,
        uint256 roundIndex,
        address winner,
        uint256 timestamp
    ) internal {
        if (!periodExists(state, periodIndex)) revert ArisanErrors.PeriodDoesNotExist();
        if (roundIndex >= state.periods[periodIndex].rounds.length)
            revert ArisanErrors.PeriodDoesNotExist();

        Round storage round = state.periods[periodIndex].rounds[roundIndex];
        round.drawnAt = timestamp;
        round.winner = winner;
    }

    /// @notice Remove a due winner from the period
    /// @param state The periods state
    /// @param periodIndex Index of the period
    /// @param winnerIndex Index in the dueWinners array
    function removeDueWinner(
        PeriodsState storage state,
        uint256 periodIndex,
        uint256 winnerIndex
    ) internal {
        if (!periodExists(state, periodIndex)) revert ArisanErrors.PeriodDoesNotExist();

        Period storage period = state.periods[periodIndex];
        if (winnerIndex >= period.dueWinners.length) revert ArisanErrors.NoDueWinnersRemaining();

        // Swap with last and pop
        address lastWinner = period.dueWinners[period.dueWinners.length - 1];
        period.dueWinners[winnerIndex] = lastWinner;
        period.dueWinners.pop();
    }

    /// @notice Create a new round in the period
    /// @param state The periods state
    /// @param periodIndex Index of the period
    function createNewRound(PeriodsState storage state, uint256 periodIndex) internal {
        if (!periodExists(state, periodIndex)) revert ArisanErrors.PeriodDoesNotExist();
        state.periods[periodIndex].rounds.push();
    }

    /// @notice Update period balance after payouts
    /// @param state The periods state
    /// @param periodIndex Index of the period
    /// @param amount Amount to deduct
    function deductFromBalance(
        PeriodsState storage state,
        uint256 periodIndex,
        uint256 amount
    ) internal {
        if (!periodExists(state, periodIndex)) revert ArisanErrors.PeriodDoesNotExist();
        state.periods[periodIndex].remainingPeriodBalanceInWei -= amount;
    }

    /// @notice Period to ExternalPeriod for external data read
    /// @param period the period data
    function toExternal(Period storage period) internal view returns (ExternalPeriod memory) {
        return ExternalPeriod({
            startedAt: period.startedAt,
            endedAt: period.endedAt,
            remainingPeriodBalanceInWei: period.remainingPeriodBalanceInWei,
            contributionAmountInWei: period.contributionAmountInWei,
            coordinatorCommissionPercentage: period.coordinatorCommissionPercentage,
            prizePercentage: period.prizePercentage,
            roundsCount: period.rounds.length,
            dueWinnersCount: period.dueWinners.length
        });
    }
}

// src/Group.sol

/// @title Group
/// @notice Main Arisan group contract managing members, periods, and governance
/// @dev Uses library pattern for state management and logic separation

contract Group is IGroup {
    using ArisanMembers for ArisanMembers.MembersState;
    using ArisanPeriods for ArisanPeriods.PeriodsState;
    using ArisanProposals for ArisanProposals.ProposalsState;
    using ArisanCapacity for ArisanCapacity.CapacityState;

    // ========== Join Mechanism ==========

    /// @notice Whether open join (no approval) is enabled
    bool public openJoinEnabled;

    /// @notice Mapping to track pending join requests (address -> username)
    mapping(address => string) private pendingJoinRequests;

    // ========== Platform Configuration ==========

    /// @notice Developer wallet (set from factory)
    address public platformWallet;

    /// @notice Capacity upgrade cost per tier (immutable from factory)
    uint256 public capacityUpgradeCost;

    // ========== State Variables ==========

    string public title;
    string public telegramGroupUrl;
    address public coordinator;
    uint256 public coordinatorCommissionPercentage;
    uint256 public contributionAmountInWei;
    uint256 public prizePercentage;

    ArisanMembers.MembersState private membersState;
    ArisanPeriods.PeriodsState private periodsState;
    ArisanProposals.ProposalsState private proposalsState;

    // Proposal value storage
    mapping(uint256 => string) private stringProposalValues;
    mapping(uint256 => uint256) private uintProposalValues;
    mapping(uint256 => address) private coordinatorProposalValues;
    mapping(uint256 => NewMemberProposalValue) private newMemberProposalValues;
    mapping(uint256 => TransferProposalValue) private transferProposalValues;

    // ========== Events (additional to interface) ==========

    event ProposalApproved(uint256 indexed proposalIndex, ProposalCategory indexed category);
    event ProposalRejected(uint256 indexed proposalIndex, ProposalCategory indexed category);

    // ========== Constructor ==========

    /// @notice Initialize a new Arisan group
    /// @param _title Title of the group
    /// @param _telegramGroupUrl Telegram group URL
    /// @param _coordinator Coordinator address
    /// @param _coordinatorTelegramUsername Coordinator's telegram username
    /// @param _coordinatorCommissionPercentage Commission percentage for coordinator
    /// @param _contributionAmountInWei Contribution amount in wei
    /// @param _prizePercentage Prize percentage for winners
    constructor(
        string memory _title,
        string memory _telegramGroupUrl,
        address _coordinator,
        string memory _coordinatorTelegramUsername,
        uint256 _coordinatorCommissionPercentage,
        uint256 _contributionAmountInWei,
        uint256 _prizePercentage
        // address _platformWallet,
        // uint256 _capacityUpgradeCost
    ) {
        // Validate inputs
        if (bytes(_title).length == 0) revert ArisanErrors.EmptyTitle();
        if (bytes(_telegramGroupUrl).length == 0) revert ArisanErrors.EmptyTelegramUrl();
        if (bytes(_coordinatorTelegramUsername).length == 0)
            revert ArisanErrors.EmptyCoordinatorUsername();
        if (_contributionAmountInWei == 0) revert ArisanErrors.InvalidContributionAmount();

        ArisanFinance.validatePercentages(_prizePercentage, _coordinatorCommissionPercentage);
        ArisanFinance.validateCoordinatorCommission(_coordinatorCommissionPercentage);

        // Set group configuration
        title = _title;
        telegramGroupUrl = _telegramGroupUrl;
        coordinator = _coordinator;
        coordinatorCommissionPercentage = _coordinatorCommissionPercentage;
        contributionAmountInWei = _contributionAmountInWei;
        prizePercentage = _prizePercentage;
        // platformWallet = _platformWallet;
        // capacityUpgradeCost = _capacityUpgradeCost;
        openJoinEnabled = false;

        // Initialize capacity state
        membersState.capacityState = ArisanCapacity.CapacityState({
            currentCapacity: ArisanCapacity.INITIAL_CAPACITY,
            upgradeCount: 0
        });

        // Add coordinator as first member
        membersState.addMember(_coordinator, _coordinatorTelegramUsername, true);
    }

    /// @notice Set platform configuration (only callable once, by factory)
    function initializePlatformConfig(address _platformWallet, uint256 _capacityUpgradeCost) external {
        require(platformWallet == address(0), "Already initialized");
        platformWallet = _platformWallet;
        capacityUpgradeCost = _capacityUpgradeCost;
    }

    // ========== Coordinator Exclusive Join Setting ======
    /// @notice Toggle open join setting (coordinator only)
    /// @param enabled Whether to enable open join
    function toggleOpenJoin(bool enabled) external coordinatorOnly {
        openJoinEnabled = enabled;
        emit OpenJoinToggled(enabled);
    }

    /// @notice Get current open join status
    /// @return Whether open join is enabled
    function isOpenJoinEnabled() external view returns (bool) {
        return openJoinEnabled;
    }

    // ========== Modifiers ==========

    modifier coordinatorOnly() {
        _coordinatorOnly();
        _;
    }

    function _coordinatorOnly() internal view {
        if (msg.sender != coordinator) revert ArisanErrors.NotCoordinator();
    }

    modifier memberOnly() {
        _memberOnly();
        _;
    }

    function _memberOnly() internal view {
        if (!membersState.isMember(msg.sender)) revert ArisanErrors.NotMember();
    }

    modifier activeVoterOnly() {
        _activeVoterOnly();
        _;
    }

    function _activeVoterOnly() internal view {
        if (!membersState.isActiveVoter(msg.sender)) revert ArisanErrors.NotActiveVoter();
    }

    modifier ongoingPeriodOnly(uint256 periodIndex) {
        _ongoingPeriodOnly(periodIndex);
        _;
    }

    function _ongoingPeriodOnly(uint256 periodIndex) internal view {
        if (!periodsState.isPeriodOngoing(periodIndex)) revert ArisanErrors.PeriodEnded();
    }

    // ========== View Functions: Group Info ==========

    /// @inheritdoc IGroup
    function getGroupDetail() external view returns (GroupData memory) {
        JoinStatus joinStatus;

        if (msg.sender == address(0)) {
            joinStatus = JoinStatus.Unknown;
        } else if (membersState.isMember(msg.sender)) {
            joinStatus = JoinStatus.Joined;
        } else if (_isWaitingForJoinApproval(msg.sender)) {
            joinStatus = JoinStatus.WaitingApproval;
        } else {
            joinStatus = JoinStatus.NotJoined;
        }

        return GroupData({
            groupAddress: address(this),
            title: title,
            telegramGroupUrl: telegramGroupUrl,
            membersCount: membersState.getMembersCount(),
            memberAddresses: membersState.getAllMemberAddresses(),
            joinStatus: joinStatus
        });
    }

    /// @inheritdoc IGroup
    function getGroupSettings() external view returns (GroupSettings memory) {
        address coordinatorAddr = coordinator;
        return GroupSettings({
            title: title,
            telegramGroupUrl: telegramGroupUrl,
            coordinator: ArisanMembers.toExternal(coordinatorAddr, membersState.members[coordinatorAddr]),
            coordinatorCommissionPercentage: coordinatorCommissionPercentage,
            contributionAmountInWei: contributionAmountInWei,
            prizePercentage: prizePercentage,
            maxCapacity: membersState.capacityState.currentCapacity,
            capacityUpgradeCount: membersState.capacityState.upgradeCount,
            openJoinEnabled: openJoinEnabled
        });
    }

    // ========== View Functions: Members ==========

    /// @inheritdoc IGroup
    function getMemberByIndex(uint256 index) external view returns (ExternalMember memory) {
        (address memberAddr, ) = membersState.getMemberByIndex(index);
        return ArisanMembers.toExternal(memberAddr, membersState.members[memberAddr]);
    }

    /// @inheritdoc IGroup
    function getMembersCount() external view returns (uint256) {
        return membersState.getMembersCount();
    }

    /// @inheritdoc IGroup
    function getActiveVotersCount() external view returns (uint256) {
        return membersState.getActiveVotersCount();
    }

    /// @inheritdoc IGroup
    function getMemberByAddress(address memberAddress) external view returns (ExternalMember memory) {
        return ArisanMembers.toExternal(memberAddress, membersState.members[memberAddress]);
    }

    /// @inheritdoc IGroup
    function isMember(address person) external view returns (bool) {
        return membersState.isMember(person);
    }

    // ========== View Functions: Periods ==========

    /// @inheritdoc IGroup
    function getPeriodsCount() external view returns (uint256) {
        return periodsState.getPeriodsCount();
    }

    /// @inheritdoc IGroup
    function getPeriodByIndex(uint256 index) external view returns (ExternalPeriod memory) {
        return periodsState.getPeriodByIndex(index);
    }

    /// @inheritdoc IGroup
    function getCurrentPeriod() external view returns (ExternalPeriod memory, bool onGoing) {
        return (ArisanPeriods.toExternal(periodsState.getLastPeriod()), (periodsState.getLastPeriod().endedAt == 0));
    }

    /// @inheritdoc IGroup
    function getCurrentPeriodDueWinners() external view returns (address[] memory) {
        return periodsState.getLastPeriod().dueWinners;
    }

    /// @inheritdoc IGroup
    function getRoundByIndexAndPeriodIndex(uint256 roundIndex, uint256 periodIndex)
        external
        view
        returns (ExternalRound memory)
    {
        return periodsState.getRoundByIndex(periodIndex, roundIndex, membersState);
    }

    /// @inheritdoc IGroup
    function getDueWinnerByIndexAndPeriodIndex(uint256 winnerIndex, uint256 periodIndex)
        external
        view
        returns (ExternalMember memory)
    {
        address dueWinner =
            periodsState.getDueWinnerByIndex(periodIndex, winnerIndex);
        return ArisanMembers.toExternal(dueWinner, membersState.members[dueWinner]);
    }

    // ========== View Functions: Proposals ==========

    /// @inheritdoc IGroup
    function hasVotedOnProposal(uint256 proposalIndex, address voter) external view returns (bool) {
        return proposalsState.hasVoted(proposalIndex, voter);
    }

    /// @inheritdoc IGroup
    function getProposalByIndex(uint256 index) external view returns (ExternalProposal memory) {
        uint256 count = proposalsState.getProposalsCount();
        if (index > count) revert ArisanErrors.ProposalDoesNotExist();

        return _buildExternalProposal(index);
    }

    /// @inheritdoc IGroup
    function getIncompleteProposalsCount() external view returns (uint256) {
        return proposalsState.getIncompleteProposalsCount();
    }

    /// @inheritdoc IGroup
    function getIncompleteProposalByIndex(uint256 index)
        external
        view
        returns (ExternalProposal memory)
    {
        uint256 count = proposalsState.getProposalsCount();

        if (index > count) revert ArisanErrors.ProposalDoesNotExist();

        for (uint256 i = 0; i < count; i++) {
            if (proposalsState.isIncompleteProposal(i)) {
                if (i == index) {
                    return _buildExternalProposal(i);
                }
            }
        }

        revert ArisanErrors.ProposalDoesNotExist();
    }

    /// @inheritdoc IGroup
    function getApproverByIndexAndProposalIndex(uint256 approverIndex, uint256 proposalIndex)
        external
        view
        returns (ExternalMember memory)
    {
        address approver = proposalsState.getApproverByIndex(proposalIndex, approverIndex);
        return ArisanMembers.toExternal(approver, membersState.members[approver]);
    }

    // ========== Member Management ==========

    /// @inheritdoc IGroup
    function proposeNewMember(address memberAddress, string calldata telegramUsername) external memberOnly {
        if (_isWaitingForJoinApproval(memberAddress)) revert ArisanErrors.AlreadyWaitingForJoinApproval();
        if (membersState.isMember(memberAddress)) revert ArisanErrors.MemberAlreadyExists();
        if (membersState.getMembersCount() >= membersState.getMaxCapacity()) revert ArisanErrors.GroupCapacityExceeded();

        uint256 proposalIndex = proposalsState.createProposal(ProposalCategory.NewMember, memberAddress);
        newMemberProposalValues[proposalIndex] = NewMemberProposalValue({
            memberAddress: memberAddress,
            telegramUsername: telegramUsername
        });

        emit ProposalCreated(proposalIndex, ProposalCategory.NewMember, memberAddress);
    }

    /// @inheritdoc IGroup
    function approveNewMemberProposal(uint256 proposalIndex) external activeVoterOnly {
        if (proposalsState.getProposal(proposalIndex).category != ProposalCategory.NewMember)
            revert ArisanErrors.InvalidProposalCategory();
        if (membersState.getMembersCount() >= membersState.getMaxCapacity()) revert ArisanErrors.GroupCapacityExceeded();

        bool isApproved =
            proposalsState.recordVote(proposalIndex, msg.sender, true, _calculateRequiredApprovals(membersState.getActiveVotersCount()));

        if (isApproved) {
            NewMemberProposalValue storage newMemberVal = newMemberProposalValues[proposalIndex];
            bool shouldBeActiveVoter = periodsState.getPeriodsCount() == 0;

            membersState.addMember(newMemberVal.memberAddress, newMemberVal.telegramUsername, shouldBeActiveVoter);

            emit MemberJoined(newMemberVal.memberAddress, newMemberVal.telegramUsername);
            emit ProposalApproved(proposalIndex, ProposalCategory.NewMember);

            delete newMemberProposalValues[proposalIndex];
        }
    }

    /// @inheritdoc IGroup
    function rejectNewMemberProposal(uint256 proposalIndex) external activeVoterOnly {
        if (proposalsState.getProposal(proposalIndex).category != ProposalCategory.NewMember)
            revert ArisanErrors.InvalidProposalCategory();

        proposalsState.rejectProposal(proposalIndex);
        emit ProposalRejected(proposalIndex, ProposalCategory.NewMember);

        delete newMemberProposalValues[proposalIndex];
    }

    /// @inheritdoc IGroup
    function leave() external memberOnly {
        if (msg.sender == coordinator) revert ArisanErrors.CoordinatorCannotLeave();

        if (periodsState.getPeriodsCount() > 0) {
            uint256 lastPeriodIndex = periodsState.getPeriodsCount() - 1;
            bool isParticipating =
                periodsState.hasParticipated(lastPeriodIndex, msg.sender)
                && periodsState.isPeriodOngoing(lastPeriodIndex);

            if (isParticipating) revert ArisanErrors.CannotLeaveWhileParticipating();
        }

        membersState.removeMember(msg.sender);
        emit MemberLeft(msg.sender);
    }

    // ========== Period Management ==========

    /// @inheritdoc IGroup
    function startPeriod() external payable coordinatorOnly {
        if (periodsState.getPeriodsCount() > 0) {
            uint256 lastPeriodIndex = periodsState.getPeriodsCount() - 1;
            if (periodsState.isPeriodOngoing(lastPeriodIndex))
                revert ArisanErrors.LastPeriodNotEnded();
        }

        // Get snapshot of all active members at period start
        address[] memory activeMembers = membersState.getAllMemberAddresses();

        uint256 periodIndex = periodsState.createPeriod(
            coordinatorCommissionPercentage,
            contributionAmountInWei,
            prizePercentage,
            activeMembers
        );

        _contribute(periodIndex);
        emit PeriodStarted(periodIndex, block.timestamp);
    }

    /// @inheritdoc IGroup
    function contribute(uint256 periodIndex) external payable memberOnly ongoingPeriodOnly(periodIndex) {
        _contribute(periodIndex);
    }

    /// @inheritdoc IGroup
    function drawWinner(uint256 periodIndex) external coordinatorOnly ongoingPeriodOnly(periodIndex) {
        ArisanPeriods.PeriodsState storage periods = periodsState;
        ArisanMembers.MembersState storage members = membersState;

        // Get period and validate
        if (periods.getDueWinners(periodIndex).length == 0) revert ArisanErrors.NoDueWinnersRemaining();

        uint256 roundIndex = periods.periods[periodIndex].rounds.length - 1;
        uint256 contributorCount = periods.getContributorCount(periodIndex, roundIndex);
        uint256 expectedContributors = periods.getParticipantCount(periodIndex);
        
        if (contributorCount != expectedContributors) revert ArisanErrors.IncompleteRound();

        // Draw winner
        uint256 dueWinnersLength = periods.getDueWinners(periodIndex).length;
        uint256 winnerIndex = dueWinnersLength > 1 ? _generateRandomIndex(dueWinnersLength - 1) : 0;
        address winner = periods.getDueWinnerByIndex(periodIndex, winnerIndex);

        // Register winner
        periods.registerWinner(periodIndex, roundIndex, winner, block.timestamp);

        // Remove from due winners
        periods.removeDueWinner(periodIndex, winnerIndex);

        // Calculate and transfer payouts
        _executeWinnerPayouts(periodIndex, winner, contributorCount);
        // uint256 totalContributions = periods.periods[periodIndex].contributionAmountInWei * contributorCount;
        // uint256 prizePayout = ArisanFinance.calculatePrize(totalContributions, prizePercentage);
        // uint256 commissionPayout = ArisanFinance.calculateCommission(totalContributions, coordinatorCommissionPercentage);

        // Split commission into net and platform fee
        // (uint256 coordinatorNetPayout, uint256 platformFee) = ArisanFinance.splitCoordinatorCommission(commissionPayout);

        // Transfer payouts
        // (bool successWinner, ) = payable(winner).call{value: prizePayout}("");
        // require(successWinner, "Winner payment failed");
        
        // (bool successCoordinator, ) = payable(coordinator).call{value: coordinatorNetPayout}("");
        // require(successCoordinator, "Coordinator payment failed");
        
        // Transfer platform fee
        // (bool successPlatform, ) = payable(platformWallet).call{value: platformFee}("");
        // require(successPlatform, "Platform fee payment failed");

        // ArisanFinance.transfer(payable(winner), prizePayout);
        // ArisanFinance.transfer(payable(coordinator), commissionPayout);
        // ArisanFinance.transfer(payable(platformWallet), platformFee);

        // periods.deductFromBalance(periodIndex, prizePayout + commissionPayout);

        // Create next round or end period
        if (periods.getDueWinners(periodIndex).length > 0) {
            periods.createNewRound(periodIndex);
        } else {
            _endPeriod(periodIndex);
        }

        emit WinnerDrawn(ArisanMembers.toExternal(winner, members.members[winner]), periodIndex, roundIndex);
    }

    /// @notice Helper: Execute all winner payouts
    function _executeWinnerPayouts(
        uint256 periodIndex,
        address winner,
        uint256 contributorCount
    ) private {
        ArisanPeriods.PeriodsState storage periods = periodsState;
        
        uint256 totalContributions = periods.periods[periodIndex].contributionAmountInWei * contributorCount;
        uint256 prizePayout = ArisanFinance.calculatePrize(totalContributions, prizePercentage);
        uint256 commissionPayout = ArisanFinance.calculateCommission(totalContributions, coordinatorCommissionPercentage);
        (uint256 coordinatorNetPayout, uint256 platformFee) = ArisanFinance.splitCoordinatorCommission(commissionPayout);

        ArisanFinance.transfer(payable(winner), prizePayout);
        ArisanFinance.transfer(payable(coordinator), coordinatorNetPayout);
        ArisanFinance.transfer(payable(platformWallet), platformFee);

        periods.deductFromBalance(periodIndex, prizePayout + commissionPayout);
    }

    // ========== Governance: String Proposals ==========

    /// @inheritdoc IGroup
    function proposeNewTitle(string calldata newValue) external activeVoterOnly {
        uint256 proposalIndex = proposalsState.createProposal(ProposalCategory.Title, msg.sender);
        stringProposalValues[proposalIndex] = newValue;

        emit ProposalCreated(proposalIndex, ProposalCategory.Title, msg.sender);
    }

    /// @inheritdoc IGroup
    function approveNewTitleProposal(uint256 proposalIndex) external activeVoterOnly {
        if (proposalsState.getProposal(proposalIndex).category != ProposalCategory.Title)
            revert ArisanErrors.InvalidProposalCategory();

        bool isApproved = proposalsState.recordVote(
            proposalIndex, msg.sender, true, _calculateRequiredApprovals(membersState.getActiveVotersCount())
        );

        if (isApproved) {
            title = stringProposalValues[proposalIndex];
            emit ProposalApproved(proposalIndex, ProposalCategory.Title);
            delete stringProposalValues[proposalIndex];
        }
    }

    /// @inheritdoc IGroup
    function proposeNewTelegramGroupUrl(string calldata newValue) external activeVoterOnly {
        uint256 proposalIndex = proposalsState.createProposal(ProposalCategory.TelegramGroupUrl, msg.sender);
        stringProposalValues[proposalIndex] = newValue;

        emit ProposalCreated(proposalIndex, ProposalCategory.TelegramGroupUrl, msg.sender);
    }

    /// @inheritdoc IGroup
    function approveNewTelegramGroupUrlProposal(uint256 proposalIndex) external activeVoterOnly {
        if (proposalsState.getProposal(proposalIndex).category !=
            ProposalCategory.TelegramGroupUrl) revert ArisanErrors.InvalidProposalCategory();

        bool isApproved = proposalsState.recordVote(
            proposalIndex, msg.sender, true, _calculateRequiredApprovals(membersState.getActiveVotersCount())
        );

        if (isApproved) {
            telegramGroupUrl = stringProposalValues[proposalIndex];
            emit ProposalApproved(proposalIndex, ProposalCategory.TelegramGroupUrl);
            delete stringProposalValues[proposalIndex];
        }
    }

    /// @inheritdoc IGroup
    function rejectStringProposal(uint256 proposalIndex) external activeVoterOnly {
        ProposalCategory category = proposalsState.getProposal(proposalIndex).category;
        if (category != ProposalCategory.Title && category != ProposalCategory.TelegramGroupUrl)
            revert ArisanErrors.InvalidProposalCategory();

        proposalsState.rejectProposal(proposalIndex);
        emit ProposalRejected(proposalIndex, category);

        delete stringProposalValues[proposalIndex];
    }

    // ========== Governance: Uint Proposals ==========

    /// @inheritdoc IGroup
    function proposeNewContributionAmountInWei(uint256 newContributionAmountInWei) external activeVoterOnly {
        if (newContributionAmountInWei == 0) revert ArisanErrors.InvalidContributionAmount();

        uint256 proposalIndex =
            proposalsState.createProposal(ProposalCategory.ContributionAmount, msg.sender);
        uintProposalValues[proposalIndex] = newContributionAmountInWei;

        emit ProposalCreated(proposalIndex, ProposalCategory.ContributionAmount, msg.sender);
    }

    /// @inheritdoc IGroup
    function approveContributionAmountProposal(uint256 proposalIndex) external activeVoterOnly {
        if (proposalsState.getProposal(proposalIndex).category !=
            ProposalCategory.ContributionAmount) revert ArisanErrors.InvalidProposalCategory();

        bool isApproved = proposalsState.recordVote(
            proposalIndex, msg.sender, true, _calculateRequiredApprovals(membersState.getActiveVotersCount())
        );

        if (isApproved) {
            contributionAmountInWei = uintProposalValues[proposalIndex];
            emit ProposalApproved(proposalIndex, ProposalCategory.ContributionAmount);
            delete uintProposalValues[proposalIndex];
        }
    }

    /// @inheritdoc IGroup
    function proposeNewPrizePercentage(uint256 newPrizePercentage) external activeVoterOnly {
        ArisanFinance.validatePercentages(newPrizePercentage, coordinatorCommissionPercentage);

        uint256 proposalIndex =
            proposalsState.createProposal(ProposalCategory.PrizePercentage, msg.sender);
        uintProposalValues[proposalIndex] = newPrizePercentage;

        emit ProposalCreated(proposalIndex, ProposalCategory.PrizePercentage, msg.sender);
    }

    /// @inheritdoc IGroup
    function approvePrizePercentageProposal(uint256 proposalIndex) external activeVoterOnly {
        if (proposalsState.getProposal(proposalIndex).category !=
            ProposalCategory.PrizePercentage) revert ArisanErrors.InvalidProposalCategory();

        bool isApproved = proposalsState.recordVote(
            proposalIndex, msg.sender, true, _calculateRequiredApprovals(membersState.getActiveVotersCount())
        );

        if (isApproved) {
            prizePercentage = uintProposalValues[proposalIndex];
            emit ProposalApproved(proposalIndex, ProposalCategory.PrizePercentage);
            delete uintProposalValues[proposalIndex];
        }
    }

    /// @inheritdoc IGroup
    function proposeNewCoordinatorCommissionPercentage(uint256 newCoordinatorCommissionPercentage)
        external
        activeVoterOnly
    {
        ArisanFinance.validatePercentages(prizePercentage, newCoordinatorCommissionPercentage);
        ArisanFinance.validateCoordinatorCommission(newCoordinatorCommissionPercentage);

        uint256 proposalIndex = proposalsState.createProposal(
            ProposalCategory.CoordinatorCommissionPercentage, msg.sender
        );
        uintProposalValues[proposalIndex] = newCoordinatorCommissionPercentage;

        emit ProposalCreated(proposalIndex, ProposalCategory.CoordinatorCommissionPercentage, msg.sender);
    }

    /// @inheritdoc IGroup
    function approveNewCoordinatorCommissionPercentageProposal(uint256 proposalIndex)
        external
        activeVoterOnly
    {
        if (proposalsState.getProposal(proposalIndex).category !=
            ProposalCategory.CoordinatorCommissionPercentage) revert ArisanErrors.InvalidProposalCategory();

        bool isApproved = proposalsState.recordVote(
            proposalIndex, msg.sender, true, _calculateRequiredApprovals(membersState.getActiveVotersCount())
        );

        if (isApproved) {
            coordinatorCommissionPercentage = uintProposalValues[proposalIndex];
            emit ProposalApproved(proposalIndex, ProposalCategory.CoordinatorCommissionPercentage);
            delete uintProposalValues[proposalIndex];
        }
    }

    /// @inheritdoc IGroup
    function rejectUintProposal(uint256 proposalIndex) external activeVoterOnly {
        ProposalCategory category = proposalsState.getProposal(proposalIndex).category;
        if (category != ProposalCategory.ContributionAmount && category != ProposalCategory.PrizePercentage
            && category != ProposalCategory.CoordinatorCommissionPercentage)
            revert ArisanErrors.InvalidProposalCategory();

        proposalsState.rejectProposal(proposalIndex);
        emit ProposalRejected(proposalIndex, category);

        delete uintProposalValues[proposalIndex];
    }

    // ========== Governance: Coordinator Proposals ==========

    /// @inheritdoc IGroup
    function proposeNewCoordinator(address newCoordinator) external activeVoterOnly {
        if (newCoordinator == address(0)) revert ArisanErrors.InvalidRecipient();

        uint256 proposalIndex =
            proposalsState.createProposal(ProposalCategory.Coordinator, msg.sender);
        coordinatorProposalValues[proposalIndex] = newCoordinator;

        emit ProposalCreated(proposalIndex, ProposalCategory.Coordinator, msg.sender);
    }

    /// @inheritdoc IGroup
    function approveNewCoordinatorProposal(uint256 proposalIndex) external activeVoterOnly {
        if (proposalsState.getProposal(proposalIndex).category != ProposalCategory.Coordinator)
            revert ArisanErrors.InvalidProposalCategory();

        bool isApproved = proposalsState.recordVote(
            proposalIndex, msg.sender, true, _calculateRequiredApprovals(membersState.getActiveVotersCount())
        );

        if (isApproved) {
            coordinator = coordinatorProposalValues[proposalIndex];
            emit ProposalApproved(proposalIndex, ProposalCategory.Coordinator);
            delete coordinatorProposalValues[proposalIndex];
        }
    }

    /// @inheritdoc IGroup
    function rejectNewCoordinatorProposal(uint256 proposalIndex) external activeVoterOnly {
        if (proposalsState.getProposal(proposalIndex).category != ProposalCategory.Coordinator)
            revert ArisanErrors.InvalidProposalCategory();

        proposalsState.rejectProposal(proposalIndex);
        emit ProposalRejected(proposalIndex, ProposalCategory.Coordinator);

        delete coordinatorProposalValues[proposalIndex];
    }

    // ========== Governance: Transfer Proposals ==========

    /// @inheritdoc IGroup
    function proposeTransfer(address recipient, uint256 transferAmount) external activeVoterOnly {
        if (recipient == address(0)) revert ArisanErrors.InvalidRecipient();
        if (transferAmount == 0) revert ArisanErrors.AmountIsZero();

        uint256 lockedBalance = _getLockedBalance();

        if (!ArisanFinance.hasSufficientBalance(address(this).balance, lockedBalance, transferAmount)) {
            revert ArisanErrors.InsufficientBalance();
        }

        uint256 proposalIndex = proposalsState.createProposal(ProposalCategory.Transfer, msg.sender);
        transferProposalValues[proposalIndex] = TransferProposalValue({
            recipient: payable(recipient),
            transferAmount: transferAmount
        });

        emit ProposalCreated(proposalIndex, ProposalCategory.Transfer, msg.sender);
    }

    /// @inheritdoc IGroup
    function approveTransferProposal(uint256 proposalIndex) external activeVoterOnly {
        if (proposalsState.getProposal(proposalIndex).category != ProposalCategory.Transfer)
            revert ArisanErrors.InvalidProposalCategory();

        // Revalidate balance before approval
        uint256 lockedBalance = _getLockedBalance();
        uint256 transferAmount = transferProposalValues[proposalIndex].transferAmount;
        if (!ArisanFinance.hasSufficientBalance(address(this).balance, lockedBalance, transferAmount)) {
            revert ArisanErrors.InsufficientBalance();
        }

        bool isApproved = proposalsState.recordVote(
            proposalIndex, msg.sender, true, _calculateRequiredApprovals(membersState.getActiveVotersCount())
        );

        if (isApproved) {
            ArisanFinance.transfer(
                transferProposalValues[proposalIndex].recipient,
                transferProposalValues[proposalIndex].transferAmount
            );

            emit TransferExecuted(
                transferProposalValues[proposalIndex].recipient, transferProposalValues[proposalIndex].transferAmount
            );
            emit ProposalApproved(proposalIndex, ProposalCategory.Transfer);

            delete transferProposalValues[proposalIndex];
        }
    }

    /// @inheritdoc IGroup
    function rejectTransferProposal(uint256 proposalIndex) external activeVoterOnly {
        if (proposalsState.getProposal(proposalIndex).category != ProposalCategory.Transfer)
            revert ArisanErrors.InvalidProposalCategory();

        proposalsState.rejectProposal(proposalIndex);
        emit ProposalRejected(proposalIndex, ProposalCategory.Transfer);

        delete transferProposalValues[proposalIndex];
    }

    // ========== Internal Functions ==========

    /// @notice calculate required approvals for proposals (CHANGE HERE)
    /// @param activeVoters amount of active voters
    function _calculateRequiredApprovals(uint256 activeVoters) private pure returns (uint256) {
        if (activeVoters == 0) return 1;
        uint256 required = (activeVoters * 50 / 100) + 1;  // 50% threshold
        return required > activeVoters ? activeVoters : required;
    }

    /// @notice Contribute to a period (internal helper)
    /// @param periodIndex Index of the period
    function _contribute(uint256 periodIndex) internal {
        if (!membersState.isMember(msg.sender)) revert ArisanErrors.NotMember();
        if (!periodsState.isPeriodOngoing(periodIndex))
            revert ArisanErrors.PeriodEnded();

        ArisanPeriods.PeriodsState storage periods = periodsState;
        uint256 currentRoundCount = periods.periods[periodIndex].rounds.length;
        uint256 previousParticipationCount =
            periods.getParticipationCount(periodIndex, msg.sender);
        uint256 roundsSinceLast = currentRoundCount - previousParticipationCount;

        if (roundsSinceLast != 1) revert ArisanErrors.DidNotParticipateInPreviousRound();

        uint256 requiredContribution =
            ArisanFinance.calculateContributionAmount(contributionAmountInWei, roundsSinceLast);
        if (msg.value != requiredContribution) revert ArisanErrors.IncorrectContributionAmount();

        // Record contribution
        periods.recordContribution(periodIndex, msg.sender, msg.value);

        // Update member status
        membersState.updateLatestPeriodParticipation(msg.sender, periodIndex);
        if (!membersState.isActiveVoter(msg.sender)) {
            membersState.setActiveVoter(msg.sender);
        }
    }

    /// @notice End a period and remove inactive voters
    /// @param periodIndex Index of the period
    function _endPeriod(uint256 periodIndex) private {
        if (proposalsState.getIncompleteProposalsCount() > 0) {
            revert ArisanErrors.IncompleteProposalsRemaining();
        }

        periodsState.endPeriod(periodIndex);
        // _removeInactiveVoters();

        emit PeriodEnded(periodIndex, block.timestamp);
    }

    /// @notice Remove voting rights from inactive members
    // function _removeInactiveVoters() private {
    //     uint256 periodsCount = periodsState.getPeriodsCount();

    //     if (periodsCount >= 2) {
    //         uint256 checkIndex = periodsCount - 2;
    //         address[] memory participants = periodsState.getDueWinners(checkIndex);

    //         for (uint256 i = 0; i < participants.length; i++) {
    //             address participant = participants[i];
    //             if (membersState.members[participant].latestPeriodParticipation <= checkIndex) {
    //                 membersState.setInactiveVoter(participant);
    //             }
    //         }
    //     }
    // }

    /// @notice Check if sender is waiting for join approval
    /// @param account Address to check
    /// @return True if waiting for approval
    function _isWaitingForJoinApproval(address account) private view returns (bool) {
        for (uint256 i = 0; i < proposalsState.getProposalsCount(); i++) {
            if (proposalsState.isIncompleteProposal(i)) {
                if (proposalsState.getProposal(i).category == ProposalCategory.NewMember) {
                    if (newMemberProposalValues[i].memberAddress == account) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /// @notice Get locked balance (balance in ongoing period)
    /// @return Locked balance amount
    function _getLockedBalance() private view returns (uint256) {
        if (periodsState.getPeriodsCount() == 0) return 0;

        uint256 lastPeriodIndex = periodsState.getPeriodsCount() - 1;
        if (!periodsState.isPeriodOngoing(lastPeriodIndex)) return 0;

        return periodsState.periods[lastPeriodIndex].remainingPeriodBalanceInWei;
    }

    /// @notice Generate a pseudorandom number
    /// @param max Upper bound (exclusive)
    /// @return Random number between 0 and max-1
    function _generateRandomIndex(uint256 max) private view returns (uint256) {
        if (max == 0) return 0;
        return uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao))) % max;
    }

    /// @notice Build external proposal from internal storage
    /// @param proposalIndex Index of the proposal
    /// @return External proposal representation
    function _buildExternalProposal(uint256 proposalIndex)
        private
        view
        returns (ExternalProposal memory)
    {
        ArisanProposals.ProposalsState storage proposals = proposalsState;
        ArisanMembers.MembersState storage members = membersState;

        return ExternalProposal({
            index: proposalIndex,
            category: proposals.getProposal(proposalIndex).category,
            proposedAt: proposals.getProposal(proposalIndex).proposedAt,
            proposer: ArisanMembers.toExternal(
                proposals.getProposal(proposalIndex).proposer,
                members.members[proposals.getProposal(proposalIndex).proposer]
            ),
            completedAt: proposals.getProposal(proposalIndex).completedAt,
            isApproved: proposals.getProposal(proposalIndex).isApproved,
            approversCount: proposals.getApproversCount(proposalIndex),
            stringProposalValue: stringProposalValues[proposalIndex],
            uintProposalValue: uintProposalValues[proposalIndex],
            coordinatorProposalValue: ArisanMembers.toExternal(
                coordinatorProposalValues[proposalIndex],
                members.members[coordinatorProposalValues[proposalIndex]]
            ),
            newMemberProposalValue: newMemberProposalValues[proposalIndex],
            transferProposalValue: transferProposalValues[proposalIndex]
        });
    }

    /// @notice Upgrade group capacity to next tier (coordinator only)
    /// @dev Payment must be exact - no refunds for excess
    function upgradeCapacity() external payable {
        if (msg.sender != coordinator) {
            revert ArisanErrors.NotCoordinator();
        }
        
        if (msg.value != capacityUpgradeCost) {
            revert ArisanErrors.IncorrectCapacityUpgradePayment();
        }
        
        if (!ArisanCapacity.canUpgrade(
            membersState.capacityState.currentCapacity,
            membersState.memberAddresses.length
        )) {
            revert ArisanErrors.CannotUpgradeAtCurrentMemberCount();
        }
        
        // Perform upgrade
        uint256 oldCapacity = membersState.capacityState.currentCapacity;
        ArisanCapacity.performUpgrade(
            membersState.capacityState,
            membersState.memberAddresses.length
        );
        uint256 newCapacity = membersState.capacityState.currentCapacity;
        
        // Send payment to platform wallet
        ArisanFinance.transfer(payable(platformWallet), msg.value);
        // (bool success, ) = payable(platformWallet).call{value: msg.value}("");
        // require(success, "Platform payment failed");
        
        emit CapacityUpgraded(oldCapacity, newCapacity, msg.value);
    }

    /// @notice Get current group capacity limit
    function getMaxCapacity() external view returns (uint256) {
        return membersState.capacityState.currentCapacity;
    }

    /// @notice Get available member slots
    function getAvailableCapacity() external view returns (uint256) {
        return ArisanCapacity.getAvailableCapacity(
            membersState.capacityState,
            membersState.memberAddresses.length
        );
    }

    /// @notice Get total capacity upgrades performed
    function getCapacityUpgradeCount() external view returns (uint256) {
        return membersState.capacityState.upgradeCount;
    }

    /// @notice Get next capacity tier after upgrade
    function getNextCapacityTier() external view returns (uint256) {
        return ArisanCapacity.getNextCapacity(membersState.capacityState.currentCapacity);
    }

    /// @notice Request to join the group with member approval
    /// @param telegramUsername Telegram username of applicant
    /// @dev Requires approval from at least 50% of active members
    function joinGroup(string calldata telegramUsername) external {
        if (membersState.isMember(msg.sender)) revert ArisanErrors.MemberAlreadyExists();
        if (membersState.memberAddresses.length >= membersState.capacityState.currentCapacity) {
            revert ArisanErrors.GroupCapacityExceeded();
        }
        if (_isWaitingForJoinApproval(msg.sender)) revert ArisanErrors.AlreadyWaitingForJoinApproval();
        if (bytes(telegramUsername).length == 0) revert ArisanErrors.InvalidParameters();
        
        // Store pending request
        pendingJoinRequests[msg.sender] = telegramUsername;
        
        // Create new member proposal internally (using existing proposal system)
        // This will require 50% approval from active voters
        uint256 proposalIndex = proposalsState.createProposal(ProposalCategory.NewMember, msg.sender);
        
        newMemberProposalValues[proposalIndex] = NewMemberProposalValue({
            memberAddress: msg.sender,
            telegramUsername: telegramUsername
        });
        
        emit JoinRequested(msg.sender, telegramUsername);
        emit ProposalCreated(proposalIndex, ProposalCategory.NewMember, msg.sender);
    }

    /// @notice Join group directly without approval (if open join enabled)
    /// @param telegramUsername Telegram username of new member
    function joinGroupNoApproval(string calldata telegramUsername) external {
        if (!openJoinEnabled) revert ArisanErrors.JoinMechanismNotOpen();
        if (membersState.isMember(msg.sender)) revert ArisanErrors.MemberAlreadyExists();
        if (membersState.memberAddresses.length >= membersState.capacityState.currentCapacity) {
            revert ArisanErrors.GroupCapacityExceeded();
        }
        if (bytes(telegramUsername).length == 0) revert ArisanErrors.InvalidParameters();
        
        // Add directly as member
        bool shouldBeActiveVoter = periodsState.getPeriodsCount() == 0;
        membersState.addMember(msg.sender, telegramUsername, shouldBeActiveVoter);
        
        emit MemberJoined(msg.sender, telegramUsername);
    }

    /// @notice Receive ETH
    receive() external payable {}
}
`;
