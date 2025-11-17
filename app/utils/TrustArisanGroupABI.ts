export const GROUP_ABI = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_title",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_telegramGroupUrl",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_coordinator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_coordinatorTelegramUsername",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_coordinatorCommissionPercentage",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_contributionAmountInWei",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_prizePercentage",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "receive",
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "approveContributionAmountProposal",
    "inputs": [
      {
        "name": "proposalIndex",
        "type": "uint256",
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
        "name": "proposalIndex",
        "type": "uint256",
        "internalType": "uint256"
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
        "name": "proposalIndex",
        "type": "uint256",
        "internalType": "uint256"
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
        "name": "proposalIndex",
        "type": "uint256",
        "internalType": "uint256"
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
        "name": "proposalIndex",
        "type": "uint256",
        "internalType": "uint256"
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
        "name": "proposalIndex",
        "type": "uint256",
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
        "name": "proposalIndex",
        "type": "uint256",
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
        "name": "proposalIndex",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "capacityUpgradeCost",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "contribute",
    "inputs": [
      {
        "name": "periodIndex",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "contributionAmountInWei",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "coordinator",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "coordinatorCommissionPercentage",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "drawWinner",
    "inputs": [
      {
        "name": "periodIndex",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getActiveVotersCount",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getApproverByIndexAndProposalIndex",
    "inputs": [
      {
        "name": "approverIndex",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "proposalIndex",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct ExternalMember",
        "components": [
          {
            "name": "walletAddress",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "telegramUsername",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "isActiveVoter",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "latestPeriodParticipation",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
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
        "name": "",
        "type": "uint256",
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
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
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
        "name": "",
        "type": "tuple",
        "internalType": "struct ExternalPeriod",
        "components": [
          {
            "name": "startedAt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "endedAt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "remainingPeriodBalanceInWei",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "contributionAmountInWei",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "coordinatorCommissionPercentage",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "prizePercentage",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "roundsCount",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "dueWinnersCount",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      },
      {
        "name": "onGoing",
        "type": "bool",
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
        "name": "",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getDueWinnerByIndexAndPeriodIndex",
    "inputs": [
      {
        "name": "winnerIndex",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "periodIndex",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct ExternalMember",
        "components": [
          {
            "name": "walletAddress",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "telegramUsername",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "isActiveVoter",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "latestPeriodParticipation",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
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
        "name": "",
        "type": "tuple",
        "internalType": "struct GroupData",
        "components": [
          {
            "name": "groupAddress",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "title",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "telegramGroupUrl",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "membersCount",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "memberAddresses",
            "type": "address[]",
            "internalType": "address[]"
          },
          {
            "name": "joinStatus",
            "type": "uint8",
            "internalType": "enum JoinStatus"
          }
        ]
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
        "name": "",
        "type": "tuple",
        "internalType": "struct GroupSettings",
        "components": [
          {
            "name": "title",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "telegramGroupUrl",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "coordinator",
            "type": "tuple",
            "internalType": "struct ExternalMember",
            "components": [
              {
                "name": "walletAddress",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "telegramUsername",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "isActiveVoter",
                "type": "bool",
                "internalType": "bool"
              },
              {
                "name": "latestPeriodParticipation",
                "type": "uint256",
                "internalType": "uint256"
              }
            ]
          },
          {
            "name": "coordinatorCommissionPercentage",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "contributionAmountInWei",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "prizePercentage",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "maxCapacity",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "capacityUpgradeCount",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "openJoinEnabled",
            "type": "bool",
            "internalType": "bool"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getIncompleteProposalByIndex",
    "inputs": [
      {
        "name": "index",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct ExternalProposal",
        "components": [
          {
            "name": "index",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "category",
            "type": "uint8",
            "internalType": "enum ProposalCategory"
          },
          {
            "name": "proposedAt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "proposer",
            "type": "tuple",
            "internalType": "struct ExternalMember",
            "components": [
              {
                "name": "walletAddress",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "telegramUsername",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "isActiveVoter",
                "type": "bool",
                "internalType": "bool"
              },
              {
                "name": "latestPeriodParticipation",
                "type": "uint256",
                "internalType": "uint256"
              }
            ]
          },
          {
            "name": "completedAt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "isApproved",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "approversCount",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "stringProposalValue",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "uintProposalValue",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "coordinatorProposalValue",
            "type": "tuple",
            "internalType": "struct ExternalMember",
            "components": [
              {
                "name": "walletAddress",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "telegramUsername",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "isActiveVoter",
                "type": "bool",
                "internalType": "bool"
              },
              {
                "name": "latestPeriodParticipation",
                "type": "uint256",
                "internalType": "uint256"
              }
            ]
          },
          {
            "name": "newMemberProposalValue",
            "type": "tuple",
            "internalType": "struct NewMemberProposalValue",
            "components": [
              {
                "name": "memberAddress",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "telegramUsername",
                "type": "string",
                "internalType": "string"
              }
            ]
          },
          {
            "name": "transferProposalValue",
            "type": "tuple",
            "internalType": "struct TransferProposalValue",
            "components": [
              {
                "name": "recipient",
                "type": "address",
                "internalType": "address payable"
              },
              {
                "name": "transferAmount",
                "type": "uint256",
                "internalType": "uint256"
              }
            ]
          }
        ]
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
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getMaxCapacity",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
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
        "name": "memberAddress",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct ExternalMember",
        "components": [
          {
            "name": "walletAddress",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "telegramUsername",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "isActiveVoter",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "latestPeriodParticipation",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getMemberByIndex",
    "inputs": [
      {
        "name": "index",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct ExternalMember",
        "components": [
          {
            "name": "walletAddress",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "telegramUsername",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "isActiveVoter",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "latestPeriodParticipation",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
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
        "name": "",
        "type": "uint256",
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
        "name": "",
        "type": "uint256",
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
        "name": "index",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct ExternalPeriod",
        "components": [
          {
            "name": "startedAt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "endedAt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "remainingPeriodBalanceInWei",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "contributionAmountInWei",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "coordinatorCommissionPercentage",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "prizePercentage",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "roundsCount",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "dueWinnersCount",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
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
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getProposalByIndex",
    "inputs": [
      {
        "name": "index",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct ExternalProposal",
        "components": [
          {
            "name": "index",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "category",
            "type": "uint8",
            "internalType": "enum ProposalCategory"
          },
          {
            "name": "proposedAt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "proposer",
            "type": "tuple",
            "internalType": "struct ExternalMember",
            "components": [
              {
                "name": "walletAddress",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "telegramUsername",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "isActiveVoter",
                "type": "bool",
                "internalType": "bool"
              },
              {
                "name": "latestPeriodParticipation",
                "type": "uint256",
                "internalType": "uint256"
              }
            ]
          },
          {
            "name": "completedAt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "isApproved",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "approversCount",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "stringProposalValue",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "uintProposalValue",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "coordinatorProposalValue",
            "type": "tuple",
            "internalType": "struct ExternalMember",
            "components": [
              {
                "name": "walletAddress",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "telegramUsername",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "isActiveVoter",
                "type": "bool",
                "internalType": "bool"
              },
              {
                "name": "latestPeriodParticipation",
                "type": "uint256",
                "internalType": "uint256"
              }
            ]
          },
          {
            "name": "newMemberProposalValue",
            "type": "tuple",
            "internalType": "struct NewMemberProposalValue",
            "components": [
              {
                "name": "memberAddress",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "telegramUsername",
                "type": "string",
                "internalType": "string"
              }
            ]
          },
          {
            "name": "transferProposalValue",
            "type": "tuple",
            "internalType": "struct TransferProposalValue",
            "components": [
              {
                "name": "recipient",
                "type": "address",
                "internalType": "address payable"
              },
              {
                "name": "transferAmount",
                "type": "uint256",
                "internalType": "uint256"
              }
            ]
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getRoundByIndexAndPeriodIndex",
    "inputs": [
      {
        "name": "roundIndex",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "periodIndex",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct ExternalRound",
        "components": [
          {
            "name": "drawnAt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "winner",
            "type": "tuple",
            "internalType": "struct ExternalMember",
            "components": [
              {
                "name": "walletAddress",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "telegramUsername",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "isActiveVoter",
                "type": "bool",
                "internalType": "bool"
              },
              {
                "name": "latestPeriodParticipation",
                "type": "uint256",
                "internalType": "uint256"
              }
            ]
          },
          {
            "name": "contributorCount",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "hasVotedOnProposal",
    "inputs": [
      {
        "name": "proposalIndex",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "voter",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "initializePlatformConfig",
    "inputs": [
      {
        "name": "_platformWallet",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_capacityUpgradeCost",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "isMember",
    "inputs": [
      {
        "name": "person",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isOpenJoinEnabled",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "joinGroup",
    "inputs": [
      {
        "name": "telegramUsername",
        "type": "string",
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
        "name": "telegramUsername",
        "type": "string",
        "internalType": "string"
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
    "name": "openJoinEnabled",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "platformWallet",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "prizePercentage",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "proposeNewContributionAmountInWei",
    "inputs": [
      {
        "name": "newContributionAmountInWei",
        "type": "uint256",
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
        "name": "newCoordinator",
        "type": "address",
        "internalType": "address"
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
        "name": "newCoordinatorCommissionPercentage",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "proposeNewMember",
    "inputs": [
      {
        "name": "memberAddress",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "telegramUsername",
        "type": "string",
        "internalType": "string"
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
        "name": "newPrizePercentage",
        "type": "uint256",
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
        "name": "newValue",
        "type": "string",
        "internalType": "string"
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
        "name": "newValue",
        "type": "string",
        "internalType": "string"
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
        "name": "recipient",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "transferAmount",
        "type": "uint256",
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
        "name": "proposalIndex",
        "type": "uint256",
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
        "name": "proposalIndex",
        "type": "uint256",
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
        "name": "proposalIndex",
        "type": "uint256",
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
        "name": "proposalIndex",
        "type": "uint256",
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
        "name": "proposalIndex",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
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
    "name": "telegramGroupUrl",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "title",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "toggleOpenJoin",
    "inputs": [
      {
        "name": "enabled",
        "type": "bool",
        "internalType": "bool"
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
    "type": "event",
    "name": "CapacityUpgraded",
    "inputs": [
      {
        "name": "previousCapacity",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "newCapacity",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "upgradeCost",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "JoinApproved",
    "inputs": [
      {
        "name": "applicant",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "JoinRejected",
    "inputs": [
      {
        "name": "applicant",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "JoinRequested",
    "inputs": [
      {
        "name": "applicant",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "telegramUsername",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "MemberJoined",
    "inputs": [
      {
        "name": "member",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "telegramUsername",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "MemberLeft",
    "inputs": [
      {
        "name": "member",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OpenJoinToggled",
    "inputs": [
      {
        "name": "enabled",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PeriodEnded",
    "inputs": [
      {
        "name": "periodIndex",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "timestamp",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PeriodStarted",
    "inputs": [
      {
        "name": "periodIndex",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "timestamp",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ProposalApproved",
    "inputs": [
      {
        "name": "proposalIndex",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "category",
        "type": "uint8",
        "indexed": true,
        "internalType": "enum ProposalCategory"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ProposalCompleted",
    "inputs": [
      {
        "name": "proposalIndex",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "isApproved",
        "type": "bool",
        "indexed": true,
        "internalType": "bool"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ProposalCreated",
    "inputs": [
      {
        "name": "proposalIndex",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "category",
        "type": "uint8",
        "indexed": true,
        "internalType": "enum ProposalCategory"
      },
      {
        "name": "proposer",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ProposalRejected",
    "inputs": [
      {
        "name": "proposalIndex",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "category",
        "type": "uint8",
        "indexed": true,
        "internalType": "enum ProposalCategory"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "TransferExecuted",
    "inputs": [
      {
        "name": "recipient",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "WinnerDrawn",
    "inputs": [
      {
        "name": "winner",
        "type": "tuple",
        "indexed": true,
        "internalType": "struct ExternalMember",
        "components": [
          {
            "name": "walletAddress",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "telegramUsername",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "isActiveVoter",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "latestPeriodParticipation",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      },
      {
        "name": "periodIndex",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "roundIndex",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "AlreadyVotedOnProposal",
    "inputs": []
  },
  {
    "type": "error",
    "name": "AlreadyWaitingForJoinApproval",
    "inputs": []
  },
  {
    "type": "error",
    "name": "AmountIsZero",
    "inputs": []
  },
  {
    "type": "error",
    "name": "CannotLeaveWhileParticipating",
    "inputs": []
  },
  {
    "type": "error",
    "name": "CannotUpgradeAtCurrentMemberCount",
    "inputs": []
  },
  {
    "type": "error",
    "name": "CommissionPercentageTooHigh",
    "inputs": []
  },
  {
    "type": "error",
    "name": "CommissionTooLow",
    "inputs": []
  },
  {
    "type": "error",
    "name": "CoordinatorCannotLeave",
    "inputs": []
  },
  {
    "type": "error",
    "name": "DidNotParticipateInPreviousRound",
    "inputs": []
  },
  {
    "type": "error",
    "name": "EmptyCoordinatorUsername",
    "inputs": []
  },
  {
    "type": "error",
    "name": "EmptyTelegramUrl",
    "inputs": []
  },
  {
    "type": "error",
    "name": "EmptyTitle",
    "inputs": []
  },
  {
    "type": "error",
    "name": "GroupCapacityExceeded",
    "inputs": []
  },
  {
    "type": "error",
    "name": "IncompleteProposalsRemaining",
    "inputs": []
  },
  {
    "type": "error",
    "name": "IncompleteRound",
    "inputs": []
  },
  {
    "type": "error",
    "name": "IncorrectCapacityUpgradePayment",
    "inputs": []
  },
  {
    "type": "error",
    "name": "IncorrectContributionAmount",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InsufficientBalance",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidContributionAmount",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidMemberIndex",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidParameters",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidProposalCategory",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidRecipient",
    "inputs": []
  },
  {
    "type": "error",
    "name": "JoinMechanismNotOpen",
    "inputs": []
  },
  {
    "type": "error",
    "name": "LastPeriodNotEnded",
    "inputs": []
  },
  {
    "type": "error",
    "name": "MemberAlreadyExists",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NoDueWinnersRemaining",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NoPeriodOngoing",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotActiveVoter",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotCoordinator",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotMember",
    "inputs": []
  },
  {
    "type": "error",
    "name": "PercentagesSumExceeds100",
    "inputs": []
  },
  {
    "type": "error",
    "name": "PeriodDoesNotExist",
    "inputs": []
  },
  {
    "type": "error",
    "name": "PeriodEnded",
    "inputs": []
  },
  {
    "type": "error",
    "name": "PrizePercentageTooHigh",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ProposalAlreadyCompleted",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ProposalDoesNotExist",
    "inputs": []
  },
  {
    "type": "error",
    "name": "TransferFailed",
    "inputs": []
  }
] as const;