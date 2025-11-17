export const FACTORY_ABI = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_platformWallet",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "CAPACITY_UPGRADE_COST",
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
    "name": "PLATFORM_WALLET",
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
    "name": "createGroup",
    "inputs": [
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
        "name": "coordinatorTelegramUsername",
        "type": "string",
        "internalType": "string"
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
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getCapacityUpgradeCost",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "getGroupAddressByIndex",
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
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getGroupAddresses",
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
    "name": "getGroupsCount",
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
    "name": "getPlatformWallet",
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
    "type": "event",
    "name": "GroupCreated",
    "inputs": [
      {
        "name": "groupAddress",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "coordinator",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "title",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      }
    ],
    "anonymous": false
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
    "name": "PercentagesSumExceeds100",
    "inputs": []
  },
  {
    "type": "error",
    "name": "PrizePercentageTooHigh",
    "inputs": []
  }
] as const;