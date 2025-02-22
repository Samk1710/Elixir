export const address = '0x6DfC9a5C0FBf827E67062eD80a3A27Ca59b80558'

export const abi = [
    {
        "type": "constructor",
        "inputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "approveAsDonor",
        "inputs": [
            {
                "name": "_donor",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "createOrganRequest",
        "inputs": [
            {
                "name": "_hospitalId",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "_requestId",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "_organType",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "_bloodType",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "_urgencyLevel",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "_recipient",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "getAllHospitals",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "tuple[]",
                "internalType": "struct OrganDonation.Hospital[]",
                "components": [
                    {
                        "name": "id",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "name",
                        "type": "string",
                        "internalType": "string"
                    },
                    {
                        "name": "city",
                        "type": "string",
                        "internalType": "string"
                    },
                    {
                        "name": "owner",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "matchingsCompleted",
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
        "name": "getAllRequests",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "tuple[]",
                "internalType": "struct OrganDonation.OrganRequest[]",
                "components": [
                    {
                        "name": "id",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "recipient",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "organType",
                        "type": "string",
                        "internalType": "string"
                    },
                    {
                        "name": "bloodType",
                        "type": "string",
                        "internalType": "string"
                    },
                    {
                        "name": "urgencyLevel",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "isActive",
                        "type": "bool",
                        "internalType": "bool"
                    },
                    {
                        "name": "matchedDonor",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "hospitalId",
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
        "name": "getDonor",
        "inputs": [
            {
                "name": "_donor",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [
            {
                "name": "organs",
                "type": "string[]",
                "internalType": "string[]"
            },
            {
                "name": "nextOfKin",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "isActive",
                "type": "bool",
                "internalType": "bool"
            },
            {
                "name": "nextOfKinApproval",
                "type": "bool",
                "internalType": "bool"
            },
            {
                "name": "ipfsHealthRecords",
                "type": "string",
                "internalType": "string"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getHospital",
        "inputs": [
            {
                "name": "_id",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "tuple",
                "internalType": "struct OrganDonation.Hospital",
                "components": [
                    {
                        "name": "id",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "name",
                        "type": "string",
                        "internalType": "string"
                    },
                    {
                        "name": "city",
                        "type": "string",
                        "internalType": "string"
                    },
                    {
                        "name": "owner",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "matchingsCompleted",
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
        "name": "getOrganRequest",
        "inputs": [
            {
                "name": "_id",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "tuple",
                "internalType": "struct OrganDonation.OrganRequest",
                "components": [
                    {
                        "name": "id",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "recipient",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "organType",
                        "type": "string",
                        "internalType": "string"
                    },
                    {
                        "name": "bloodType",
                        "type": "string",
                        "internalType": "string"
                    },
                    {
                        "name": "urgencyLevel",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "isActive",
                        "type": "bool",
                        "internalType": "bool"
                    },
                    {
                        "name": "matchedDonor",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "hospitalId",
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
        "name": "hospitalIds",
        "inputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
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
        "name": "isOrganAvailable",
        "inputs": [
            {
                "name": "_donor",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_organ",
                "type": "string",
                "internalType": "string"
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
        "name": "matchOrgan",
        "inputs": [
            {
                "name": "_requestId",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "_donor",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "organDonationNFT",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "contract OrganDonationNFT"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "registerDonor",
        "inputs": [
            {
                "name": "_organs",
                "type": "string[]",
                "internalType": "string[]"
            },
            {
                "name": "_nextOfKin",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_ipfsHash",
                "type": "string",
                "internalType": "string"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "registerHospital",
        "inputs": [
            {
                "name": "_id",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "_name",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "_city",
                "type": "string",
                "internalType": "string"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "requestIds",
        "inputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
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
        "type": "event",
        "name": "DonorRegistered",
        "inputs": [
            {
                "name": "donor",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "organs",
                "type": "string[]",
                "indexed": false,
                "internalType": "string[]"
            },
            {
                "name": "nextOfKin",
                "type": "address",
                "indexed": false,
                "internalType": "address"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "HospitalRegistered",
        "inputs": [
            {
                "name": "id",
                "type": "uint256",
                "indexed": true,
                "internalType": "uint256"
            },
            {
                "name": "name",
                "type": "string",
                "indexed": false,
                "internalType": "string"
            },
            {
                "name": "city",
                "type": "string",
                "indexed": false,
                "internalType": "string"
            },
            {
                "name": "owner",
                "type": "address",
                "indexed": false,
                "internalType": "address"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "NFTIssued",
        "inputs": [
            {
                "name": "to",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "tokenId",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "name": "uri",
                "type": "string",
                "indexed": false,
                "internalType": "string"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "NextOfKinApproved",
        "inputs": [
            {
                "name": "donor",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "nextOfKin",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "OrganMatched",
        "inputs": [
            {
                "name": "requestId",
                "type": "uint256",
                "indexed": true,
                "internalType": "uint256"
            },
            {
                "name": "donor",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "recipient",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "OrganRequestCreated",
        "inputs": [
            {
                "name": "id",
                "type": "uint256",
                "indexed": true,
                "internalType": "uint256"
            },
            {
                "name": "organType",
                "type": "string",
                "indexed": false,
                "internalType": "string"
            },
            {
                "name": "urgencyLevel",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    }
]