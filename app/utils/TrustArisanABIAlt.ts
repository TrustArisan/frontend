// Auto-generated ABI for ArisanGroupFactory and Group contracts
// Generated on 2025-11-17 13:18:45

export const arisanGroupFactoryABI = [
  {
    "type": "function",
    "name": "getGroupAddresses",
    "inputs": [],
    "outputs": [
      {
        "type": "address[]",
        "name": "memory",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getGroupAddressByIndex",
    "inputs": [
      {
        "type": "uint256",
        "name": "index",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "type": "address",
        "name": "",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getGroupsCount",
    "inputs": [],
    "outputs": [
      {
        "type": "uint256",
        "name": "",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPlatformWallet",
    "inputs": [],
    "outputs": [
      {
        "type": "address",
        "name": "",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getCapacityUpgradeCost",
    "inputs": [],
    "outputs": [
      {
        "type": "uint256",
        "name": "",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "createGroup",
    "inputs": [
      {
        "type": "string",
        "name": "title",
        "internalType": "string"
      },
      {
        "type": "string",
        "name": "telegramGroupUrl",
        "internalType": "string"
      },
      {
        "type": "string",
        "name": "coordinatorTelegramUsername",
        "internalType": "string"
      },
      {
        "type": "uint256",
        "name": "coordinatorCommissionPercentage",
        "internalType": "uint256"
      },
      {
        "type": "uint256",
        "name": "contributionAmountInWei",
        "internalType": "uint256"
      },
      {
        "type": "uint256",
        "name": "prizePercentage",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "type": "address",
        "name": "",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  }
] as const;

export const groupABI = [
  {
    "type": "function",
    "name": "initializePlatformConfig",
    "inputs": [
      {
        "type": "address",
        "name": "_platformWallet",
        "internalType": "address"
      },
      {
        "type": "uint256",
        "name": "_capacityUpgradeCost",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "toggleOpenJoin",
    "inputs": [
      {
        "type": "bool",
        "name": "enabled",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "isOpenJoinEnabled",
    "inputs": [],
    "outputs": [
      {
        "type": "bool",
        "name": "",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getGroupDetail",
    "inputs": [],
    "outputs": [
      {
        "type": "GroupData",
        "name": "memory",
        "internalType": "GroupData"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getGroupSettings",
    "inputs": [],
    "outputs": [
      {
        "type": "GroupSettings",
        "name": "memory",
        "internalType": "GroupSettings"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getMemberByIndex",
    "inputs": [
      {
        "type": "uint256",
        "name": "index",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "type": "ExternalMember",
        "name": "memory",
        "internalType": "ExternalMember"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getMembersCount",
    "inputs": [],
    "outputs": [
      {
        "type": "uint256",
        "name": "",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getActiveVotersCount",
    "inputs": [],
    "outputs": [
      {
        "type": "uint256",
        "name": "",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getMemberByAddress",
    "inputs": [
      {
        "type": "address",
        "name": "memberAddress",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "type": "ExternalMember",
        "name": "memory",
        "internalType": "ExternalMember"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isMember",
    "inputs": [
      {
        "type": "address",
        "name": "person",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "type": "bool",
        "name": "",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPeriodsCount",
    "inputs": [],
    "outputs": [
      {
        "type": "uint256",
        "name": "",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPeriodByIndex",
    "inputs": [
      {
        "type": "uint256",
        "name": "index",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "type": "ExternalPeriod",
        "name": "memory",
        "internalType": "ExternalPeriod"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getCurrentPeriod",
    "inputs": [],
    "outputs": [
      {
        "type": "ExternalPeriod",
        "name": "memory",
        "internalType": "ExternalPeriod"
      },
      {
        "type": "bool",
        "name": "onGoing",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getCurrentPeriodDueWinners",
    "inputs": [],
    "outputs": [
      {
        "type": "address[]",
        "name": "memory",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getRoundByIndexAndPeriodIndex",
    "inputs": [
      {
        "type": "uint256",
        "name": "roundIndex",
        "internalType": "uint256"
      },
      {
        "type": "uint256",
        "name": "periodIndex",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "type": "ExternalRound",
        "name": "memory",
        "internalType": "ExternalRound"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getDueWinnerByIndexAndPeriodIndex",
    "inputs": [
      {
        "type": "uint256",
        "name": "winnerIndex",
        "internalType": "uint256"
      },
      {
        "type": "uint256",
        "name": "periodIndex",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "type": "ExternalMember",
        "name": "memory",
        "internalType": "ExternalMember"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "hasVotedOnProposal",
    "inputs": [
      {
        "type": "uint256",
        "name": "proposalIndex",
        "internalType": "uint256"
      },
      {
        "type": "address",
        "name": "voter",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "type": "bool",
        "name": "",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getProposalByIndex",
    "inputs": [
      {
        "type": "uint256",
        "name": "index",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "type": "ExternalProposal",
        "name": "memory",
        "internalType": "ExternalProposal"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getIncompleteProposalsCount",
    "inputs": [],
    "outputs": [
      {
        "type": "uint256",
        "name": "",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getIncompleteProposalByIndex",
    "inputs": [
      {
        "type": "uint256",
        "name": "index",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "type": "ExternalProposal",
        "name": "memory",
        "internalType": "ExternalProposal"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getApproverByIndexAndProposalIndex",
    "inputs": [
      {
        "type": "uint256",
        "name": "approverIndex",
        "internalType": "uint256"
      },
      {
        "type": "uint256",
        "name": "proposalIndex",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "type": "ExternalMember",
        "name": "memory",
        "internalType": "ExternalMember"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "proposeNewMember",
    "inputs": [
      {
        "type": "address",
        "name": "memberAddress",
        "internalType": "address"
      },
      {
        "type": "string",
        "name": "telegramUsername",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "approveNewMemberProposal",
    "inputs": [
      {
        "type": "uint256",
        "name": "proposalIndex",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "rejectNewMemberProposal",
    "inputs": [
      {
        "type": "uint256",
        "name": "proposalIndex",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "leave",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "startPeriod",
    "inputs": [],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "contribute",
    "inputs": [
      {
        "type": "uint256",
        "name": "periodIndex",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "drawWinner",
    "inputs": [
      {
        "type": "uint256",
        "name": "periodIndex",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "proposeNewTitle",
    "inputs": [
      {
        "type": "string",
        "name": "newValue",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "approveNewTitleProposal",
    "inputs": [
      {
        "type": "uint256",
        "name": "proposalIndex",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "proposeNewTelegramGroupUrl",
    "inputs": [
      {
        "type": "string",
        "name": "newValue",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "approveNewTelegramGroupUrlProposal",
    "inputs": [
      {
        "type": "uint256",
        "name": "proposalIndex",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "rejectStringProposal",
    "inputs": [
      {
        "type": "uint256",
        "name": "proposalIndex",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "proposeNewContributionAmountInWei",
    "inputs": [
      {
        "type": "uint256",
        "name": "newContributionAmountInWei",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "approveContributionAmountProposal",
    "inputs": [
      {
        "type": "uint256",
        "name": "proposalIndex",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "proposeNewPrizePercentage",
    "inputs": [
      {
        "type": "uint256",
        "name": "newPrizePercentage",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "approvePrizePercentageProposal",
    "inputs": [
      {
        "type": "uint256",
        "name": "proposalIndex",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "proposeNewCoordinatorCommissionPercentage",
    "inputs": [
      {
        "type": "uint256",
        "name": "newCoordinatorCommissionPercentage",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "approveNewCoordinatorCommissionPercentageProposal",
    "inputs": [
      {
        "type": "uint256",
        "name": "proposalIndex",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "rejectUintProposal",
    "inputs": [
      {
        "type": "uint256",
        "name": "proposalIndex",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "proposeNewCoordinator",
    "inputs": [
      {
        "type": "address",
        "name": "newCoordinator",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "approveNewCoordinatorProposal",
    "inputs": [
      {
        "type": "uint256",
        "name": "proposalIndex",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "rejectNewCoordinatorProposal",
    "inputs": [
      {
        "type": "uint256",
        "name": "proposalIndex",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "proposeTransfer",
    "inputs": [
      {
        "type": "address",
        "name": "recipient",
        "internalType": "address"
      },
      {
        "type": "uint256",
        "name": "transferAmount",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "approveTransferProposal",
    "inputs": [
      {
        "type": "uint256",
        "name": "proposalIndex",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "rejectTransferProposal",
    "inputs": [
      {
        "type": "uint256",
        "name": "proposalIndex",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "upgradeCapacity",
    "inputs": [],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "getMaxCapacity",
    "inputs": [],
    "outputs": [
      {
        "type": "uint256",
        "name": "",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getAvailableCapacity",
    "inputs": [],
    "outputs": [
      {
        "type": "uint256",
        "name": "",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getCapacityUpgradeCount",
    "inputs": [],
    "outputs": [
      {
        "type": "uint256",
        "name": "",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getNextCapacityTier",
    "inputs": [],
    "outputs": [
      {
        "type": "uint256",
        "name": "",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "joinGroup",
    "inputs": [
      {
        "type": "string",
        "name": "telegramUsername",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "joinGroupNoApproval",
    "inputs": [
      {
        "type": "string",
        "name": "telegramUsername",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  }
] as const;

// Combined ABI (all functions from both contracts)
export const combinedABI = [
  {
    "type": "function",
    "name": "getGroupAddresses",
    "inputs": [],
    "outputs": [
      {
        "type": "address[]",
        "name": "memory",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getGroupAddressByIndex",
    "inputs": [
      {
        "type": "uint256",
        "name": "index",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "type": "address",
        "name": "",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getGroupsCount",
    "inputs": [],
    "outputs": [
      {
        "type": "uint256",
        "name": "",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPlatformWallet",
    "inputs": [],
    "outputs": [
      {
        "type": "address",
        "name": "",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getCapacityUpgradeCost",
    "inputs": [],
    "outputs": [
      {
        "type": "uint256",
        "name": "",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "createGroup",
    "inputs": [
      {
        "type": "string",
        "name": "title",
        "internalType": "string"
      },
      {
        "type": "string",
        "name": "telegramGroupUrl",
        "internalType": "string"
      },
      {
        "type": "string",
        "name": "coordinatorTelegramUsername",
        "internalType": "string"
      },
      {
        "type": "uint256",
        "name": "coordinatorCommissionPercentage",
        "internalType": "uint256"
      },
      {
        "type": "uint256",
        "name": "contributionAmountInWei",
        "internalType": "uint256"
      },
      {
        "type": "uint256",
        "name": "prizePercentage",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "type": "address",
        "name": "",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "initializePlatformConfig",
    "inputs": [
      {
        "type": "address",
        "name": "_platformWallet",
        "internalType": "address"
      },
      {
        "type": "uint256",
        "name": "_capacityUpgradeCost",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "toggleOpenJoin",
    "inputs": [
      {
        "type": "bool",
        "name": "enabled",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "isOpenJoinEnabled",
    "inputs": [],
    "outputs": [
      {
        "type": "bool",
        "name": "",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getGroupDetail",
    "inputs": [],
    "outputs": [
      {
        "type": "GroupData",
        "name": "memory",
        "internalType": "GroupData"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getGroupSettings",
    "inputs": [],
    "outputs": [
      {
        "type": "GroupSettings",
        "name": "memory",
        "internalType": "GroupSettings"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getMemberByIndex",
    "inputs": [
      {
        "type": "uint256",
        "name": "index",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "type": "ExternalMember",
        "name": "memory",
        "internalType": "ExternalMember"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getMembersCount",
    "inputs": [],
    "outputs": [
      {
        "type": "uint256",
        "name": "",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getActiveVotersCount",
    "inputs": [],
    "outputs": [
      {
        "type": "uint256",
        "name": "",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getMemberByAddress",
    "inputs": [
      {
        "type": "address",
        "name": "memberAddress",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "type": "ExternalMember",
        "name": "memory",
        "internalType": "ExternalMember"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isMember",
    "inputs": [
      {
        "type": "address",
        "name": "person",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "type": "bool",
        "name": "",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPeriodsCount",
    "inputs": [],
    "outputs": [
      {
        "type": "uint256",
        "name": "",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPeriodByIndex",
    "inputs": [
      {
        "type": "uint256",
        "name": "index",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "type": "ExternalPeriod",
        "name": "memory",
        "internalType": "ExternalPeriod"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getCurrentPeriod",
    "inputs": [],
    "outputs": [
      {
        "type": "ExternalPeriod",
        "name": "memory",
        "internalType": "ExternalPeriod"
      },
      {
        "type": "bool",
        "name": "onGoing",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getCurrentPeriodDueWinners",
    "inputs": [],
    "outputs": [
      {
        "type": "address[]",
        "name": "memory",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getRoundByIndexAndPeriodIndex",
    "inputs": [
      {
        "type": "uint256",
        "name": "roundIndex",
        "internalType": "uint256"
      },
      {
        "type": "uint256",
        "name": "periodIndex",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "type": "ExternalRound",
        "name": "memory",
        "internalType": "ExternalRound"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getDueWinnerByIndexAndPeriodIndex",
    "inputs": [
      {
        "type": "uint256",
        "name": "winnerIndex",
        "internalType": "uint256"
      },
      {
        "type": "uint256",
        "name": "periodIndex",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "type": "ExternalMember",
        "name": "memory",
        "internalType": "ExternalMember"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "hasVotedOnProposal",
    "inputs": [
      {
        "type": "uint256",
        "name": "proposalIndex",
        "internalType": "uint256"
      },
      {
        "type": "address",
        "name": "voter",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "type": "bool",
        "name": "",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getProposalByIndex",
    "inputs": [
      {
        "type": "uint256",
        "name": "index",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "type": "ExternalProposal",
        "name": "memory",
        "internalType": "ExternalProposal"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getIncompleteProposalsCount",
    "inputs": [],
    "outputs": [
      {
        "type": "uint256",
        "name": "",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getIncompleteProposalByIndex",
    "inputs": [
      {
        "type": "uint256",
        "name": "index",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "type": "ExternalProposal",
        "name": "memory",
        "internalType": "ExternalProposal"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getApproverByIndexAndProposalIndex",
    "inputs": [
      {
        "type": "uint256",
        "name": "approverIndex",
        "internalType": "uint256"
      },
      {
        "type": "uint256",
        "name": "proposalIndex",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "type": "ExternalMember",
        "name": "memory",
        "internalType": "ExternalMember"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "proposeNewMember",
    "inputs": [
      {
        "type": "address",
        "name": "memberAddress",
        "internalType": "address"
      },
      {
        "type": "string",
        "name": "telegramUsername",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "approveNewMemberProposal",
    "inputs": [
      {
        "type": "uint256",
        "name": "proposalIndex",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "rejectNewMemberProposal",
    "inputs": [
      {
        "type": "uint256",
        "name": "proposalIndex",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "leave",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "startPeriod",
    "inputs": [],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "contribute",
    "inputs": [
      {
        "type": "uint256",
        "name": "periodIndex",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "drawWinner",
    "inputs": [
      {
        "type": "uint256",
        "name": "periodIndex",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "proposeNewTitle",
    "inputs": [
      {
        "type": "string",
        "name": "newValue",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "approveNewTitleProposal",
    "inputs": [
      {
        "type": "uint256",
        "name": "proposalIndex",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "proposeNewTelegramGroupUrl",
    "inputs": [
      {
        "type": "string",
        "name": "newValue",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "approveNewTelegramGroupUrlProposal",
    "inputs": [
      {
        "type": "uint256",
        "name": "proposalIndex",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "rejectStringProposal",
    "inputs": [
      {
        "type": "uint256",
        "name": "proposalIndex",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "proposeNewContributionAmountInWei",
    "inputs": [
      {
        "type": "uint256",
        "name": "newContributionAmountInWei",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "approveContributionAmountProposal",
    "inputs": [
      {
        "type": "uint256",
        "name": "proposalIndex",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "proposeNewPrizePercentage",
    "inputs": [
      {
        "type": "uint256",
        "name": "newPrizePercentage",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "approvePrizePercentageProposal",
    "inputs": [
      {
        "type": "uint256",
        "name": "proposalIndex",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "proposeNewCoordinatorCommissionPercentage",
    "inputs": [
      {
        "type": "uint256",
        "name": "newCoordinatorCommissionPercentage",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "approveNewCoordinatorCommissionPercentageProposal",
    "inputs": [
      {
        "type": "uint256",
        "name": "proposalIndex",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "rejectUintProposal",
    "inputs": [
      {
        "type": "uint256",
        "name": "proposalIndex",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "proposeNewCoordinator",
    "inputs": [
      {
        "type": "address",
        "name": "newCoordinator",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "approveNewCoordinatorProposal",
    "inputs": [
      {
        "type": "uint256",
        "name": "proposalIndex",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "rejectNewCoordinatorProposal",
    "inputs": [
      {
        "type": "uint256",
        "name": "proposalIndex",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "proposeTransfer",
    "inputs": [
      {
        "type": "address",
        "name": "recipient",
        "internalType": "address"
      },
      {
        "type": "uint256",
        "name": "transferAmount",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "approveTransferProposal",
    "inputs": [
      {
        "type": "uint256",
        "name": "proposalIndex",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "rejectTransferProposal",
    "inputs": [
      {
        "type": "uint256",
        "name": "proposalIndex",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "upgradeCapacity",
    "inputs": [],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "getMaxCapacity",
    "inputs": [],
    "outputs": [
      {
        "type": "uint256",
        "name": "",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getAvailableCapacity",
    "inputs": [],
    "outputs": [
      {
        "type": "uint256",
        "name": "",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getCapacityUpgradeCount",
    "inputs": [],
    "outputs": [
      {
        "type": "uint256",
        "name": "",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getNextCapacityTier",
    "inputs": [],
    "outputs": [
      {
        "type": "uint256",
        "name": "",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "joinGroup",
    "inputs": [
      {
        "type": "string",
        "name": "telegramUsername",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "joinGroupNoApproval",
    "inputs": [
      {
        "type": "string",
        "name": "telegramUsername",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  }
] as const;
