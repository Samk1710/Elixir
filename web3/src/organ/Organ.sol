// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Organ is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Enum for urgency levels
    enum UrgencyLevel { Low, Medium, High, Critical, Emergency }

    // Structs
    struct OrganDonor {
        string[] organs;            // List of organs willing to donate
        address nextOfKin;          // Next of kin address for approval
        bool isActive;              // Whether donor registration is active
        bool nextOfKinApproval;     // Approval status from next of kin
        string ipfsHealthRecords;   // IPFS hash of health records
        mapping(string => bool) organStatus; // Status of each organ
    }

    struct Hospital {
        bool isVerified;
        uint256 matchingsCompleted;
        bool canMatchOrgans;
    }

    struct OrganRequest {
        address recipient;
        string organType;
        string bloodType;
        UrgencyLevel urgencyLevel;  // Urgency level of the request
        bool isActive;
        address matchedDonor;
        uint256 timestamp;
    }

    // State variables
    mapping(address => OrganDonor) public donors;
    mapping(address => Hospital) public hospitals;
    mapping(uint256 => OrganRequest) public organRequests;
    uint256 public totalRequests;

    // Events
    event DonorRegistered(address indexed donor, string[] organs);
    event NextOfKinApproved(address indexed donor, address indexed nextOfKin);
    event OrganRequestCreated(uint256 indexed requestId, address indexed recipient, string organType);
    event OrganMatched(uint256 indexed requestId, address indexed donor, address indexed recipient);
    event HospitalVerified(address indexed hospital);
    event DonorNFTMinted(address indexed donor, uint256 tokenId);
    event DonorStatusUpdated(address indexed donor, bool isActive);
    event HospitalVerificationUpdated(address indexed hospital, bool isVerified);

    // Modifiers
    modifier onlyVerifiedHospital() {
        require(hospitals[msg.sender].isVerified, "Not a verified hospital");
        _;
    }

    modifier onlyNextOfKin(address donorAddress) {
        require(donors[donorAddress].nextOfKin == msg.sender, "Not authorized next of kin");
        _;
    }

    // Constructor
    constructor() ERC721("ElixirOrganDonation", "EOD") Ownable(msg.sender) {}

    // Hospital Management
    function verifyHospital(address hospitalAddress) external onlyOwner {
        hospitals[hospitalAddress].isVerified = true;
        hospitals[hospitalAddress].canMatchOrgans = true;
        emit HospitalVerified(hospitalAddress);
    }

    // Donor Registration
    function registerAsDonor(string[] memory organsList, address nextOfKinAddress, string memory ipfsHash) external {
        require(nextOfKinAddress != address(0), "Invalid next of kin address");
        require(organsList.length > 0, "At least one organ must be specified");

        OrganDonor storage newDonor = donors[msg.sender];
        newDonor.organs = organsList;
        newDonor.nextOfKin = nextOfKinAddress;
        newDonor.isActive = true;
        newDonor.ipfsHealthRecords = ipfsHash;

        for (uint i = 0; i < organsList.length; i++) {
            require(bytes(organsList[i]).length > 0, "Organ type cannot be empty");
            newDonor.organStatus[organsList[i]] = true;
        }

        // Mint NFT for donor registration
        uint256 tokenId = _tokenIds.current();
        _mint(msg.sender, tokenId);
        _tokenIds.increment();

        emit DonorRegistered(msg.sender, organsList);
        emit DonorNFTMinted(msg.sender, tokenId);
    }

    // Next of Kin Approval
    function approveAsDonor(address donorAddress) external onlyNextOfKin(donorAddress) {
        donors[donorAddress].nextOfKinApproval = true;
        emit NextOfKinApproved(donorAddress, msg.sender);
    }

    // Organ Request Management
    function createOrganRequest(
        address recipient,
        string memory organType,
        string memory bloodType,
        UrgencyLevel urgencyLevel
    ) external onlyVerifiedHospital {
        require(bytes(organType).length > 0, "Organ type cannot be empty");
        require(bytes(bloodType).length > 0, "Blood type cannot be empty");

        uint256 requestId = totalRequests++;
        OrganRequest storage newRequest = organRequests[requestId];
        newRequest.recipient = recipient;
        newRequest.organType = organType;
        newRequest.bloodType = bloodType;
        newRequest.urgencyLevel = urgencyLevel;
        newRequest.isActive = true;
        newRequest.timestamp = block.timestamp;

        emit OrganRequestCreated(requestId, recipient, organType);
    }

    // Organ Matching
    function matchOrgan(uint256 requestId, address donorAddress) external onlyVerifiedHospital {
        require(hospitals[msg.sender].canMatchOrgans, "Hospital not authorized for matching");

        OrganRequest storage request = organRequests[requestId];
        OrganDonor storage donor = donors[donorAddress];

        require(request.isActive, "Request not active");
        require(donor.isActive, "Donor not active");
        require(donor.nextOfKinApproval, "Next of kin approval pending");
        require(donor.organStatus[request.organType], "Organ not available");

        request.matchedDonor = donorAddress;
        request.isActive = false;
        donor.organStatus[request.organType] = false;
        hospitals[msg.sender].matchingsCompleted++;

        emit OrganMatched(requestId, donorAddress, request.recipient);
    }

    // Deactivate Donor
    function deactivateDonor() external {
        require(donors[msg.sender].isActive, "Donor already inactive");
        donors[msg.sender].isActive = false;
        emit DonorStatusUpdated(msg.sender, false);
    }

    // Update Health Records
    function updateHealthRecords(string memory newIpfsHash) external {
        require(donors[msg.sender].isActive, "Donor not active");
        donors[msg.sender].ipfsHealthRecords = newIpfsHash;
    }

    // Cancel Organ Request
    function cancelOrganRequest(uint256 requestId) external onlyVerifiedHospital {
        require(organRequests[requestId].isActive, "Request not active");
        organRequests[requestId].isActive = false;
    }

    // View Functions
    function getDonorOrgans(address donor) external view returns (string[] memory) {
        return donors[donor].organs;
    }

    function isOrganAvailable(address donor, string memory organ) external view returns (bool) {
        return donors[donor].organStatus[organ];
    }

    function getHospitalStats(address hospital) external view returns (uint256) {
        return hospitals[hospital].matchingsCompleted;
    }

    function getOrganRequest(uint256 requestId) external view returns (
        address recipient,
        string memory organType,
        string memory bloodType,
        UrgencyLevel urgencyLevel,
        bool isActive,
        address matchedDonor,
        uint256 timestamp
    ) {
        OrganRequest storage request = organRequests[requestId];
        return (
            request.recipient,
            request.organType,
            request.bloodType,
            request.urgencyLevel,
            request.isActive,
            request.matchedDonor,
            request.timestamp
        );
    }
}