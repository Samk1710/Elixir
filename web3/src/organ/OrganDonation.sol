// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract OrganDonationNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;
    mapping(uint256 => string) private _tokenURIs;

    constructor() ERC721("OrganDonationNFT", "ODNFT") Ownable(msg.sender) {}

    function mint(address to, string memory uri) public onlyOwner returns (uint256) {
        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        return tokenId;
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    function _setTokenURI(uint256 tokenId, string memory uri) internal {
        require(_exists(tokenId), "URI set of nonexistent token");
        _tokenURIs[tokenId] = uri;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return _tokenURIs[tokenId];
    }
}

contract OrganDonation {
    struct Hospital {
        uint256 id;
        string name;
        string city;
        address owner;
        // bool isVerified;
        uint256 matchingsCompleted;
    }

    struct OrganRequest {
        uint256 id;
        address recipient;
        string organType;
        string bloodType;
        uint256 urgencyLevel;
        bool isActive;
        address matchedDonor;
        uint256 hospitalId;
    }

    struct Donor {
        address donor;
        string[] organs;
        address nextOfKin;
        bool isActive;
        bool nextOfKinApproval;
        string ipfsHealthRecords;
    }

    uint256[] public hospitalIds;
    uint256[] public requestIds;
    
    mapping(uint256 => Hospital) private hospitals;
    mapping(uint256 => OrganRequest) private organRequests;
    mapping(address => Donor) private donors;
    mapping(address => mapping(string => bool)) private organStatus;

    OrganDonationNFT public organDonationNFT;

    modifier onlyHospitalOwner(uint256 _id) {
        require(hospitals[_id].owner == msg.sender, "Only the hospital owner can perform this action");
        _;
    }

    modifier hospitalExists(uint256 _id) {
        require(hospitals[_id].id != 0, "Hospital does not exist");
        _;
    }

    // modifier verifiedHospital(uint256 _id) {
    //     require(hospitals[_id].isVerified, "Hospital is not verified");
    //     _;
    // }

    event HospitalRegistered(uint256 indexed id, string name, string city, address owner);
    // event HospitalVerified(uint256 indexed id);
    event DonorRegistered(address indexed donor, string[] organs, address nextOfKin);
    event NextOfKinApproved(address indexed donor, address indexed nextOfKin);
    event OrganRequestCreated(uint256 indexed id, string organType, uint256 urgencyLevel);
    event OrganMatched(uint256 indexed requestId, address indexed donor, address indexed recipient);
    event NFTIssued(address indexed to, uint256 tokenId, string uri);

    constructor() {
        organDonationNFT = new OrganDonationNFT();
    }

// org-hos-reg
    function registerHospital(
        uint256 _id,
        string memory _name,
        string memory _city
    ) public {
        require(hospitals[_id].id == 0, "Hospital ID already exists");

        hospitals[_id] = Hospital({
            id: _id,
            name: _name,
            city: _city,
            owner: msg.sender,
            matchingsCompleted: 0
        });

        hospitalIds.push(_id);
        emit HospitalRegistered(_id, _name, _city, msg.sender);
    }

    function getHospital(uint256 _id) public view hospitalExists(_id) returns (Hospital memory) {
        return hospitals[_id];
    }


    function getAllHospitals() public view returns (Hospital[] memory) {
        Hospital[] memory allHospitals = new Hospital[](hospitalIds.length);
        for (uint256 i = 0; i < hospitalIds.length; i++) {
            allHospitals[i] = hospitals[hospitalIds[i]];
        }
        return allHospitals;
    }


    // org-donor


    function registerDonor(
        string[] memory _organs,
        address _nextOfKin,
        string memory _ipfsHash
    ) public {
        require(_nextOfKin != address(0), "Invalid next of kin address");
        
        donors[msg.sender] = Donor({
            donor: msg.sender,
            organs: _organs,
            nextOfKin: _nextOfKin,
            isActive: true,
            nextOfKinApproval: false,
            ipfsHealthRecords: _ipfsHash
        });

        for(uint i = 0; i < _organs.length; i++) {
            organStatus[msg.sender][_organs[i]] = true;
        }

        string memory uri = string(abi.encodePacked("donor_", _ipfsHash));
        uint256 tokenId = organDonationNFT.mint(msg.sender, uri);
        
        emit DonorRegistered(msg.sender, _organs, _nextOfKin);
        emit NFTIssued(msg.sender, tokenId, uri);
    }

    function approveAsDonor(address _donor) public {
        require(donors[_donor].nextOfKin == msg.sender, "Not authorized next of kin");
        donors[_donor].nextOfKinApproval = true;
        emit NextOfKinApproved(_donor, msg.sender);
    }

    function getDonor(address _donor) public view returns (
        string[] memory organs,
        address nextOfKin,
        bool isActive,
        bool nextOfKinApproval,
        string memory ipfsHealthRecords
    ) {
        Donor memory donor = donors[_donor];
        return (
            donor.organs,
            donor.nextOfKin,
            donor.isActive,
            donor.nextOfKinApproval,
            donor.ipfsHealthRecords
        );
    }




//organ
    function createOrganRequest(
        uint256 _hospitalId,
        uint256 _requestId,
        string memory _organType,
        string memory _bloodType,
        uint256 _urgencyLevel,
        address _recipient
    ) public onlyHospitalOwner(_hospitalId) hospitalExists(_hospitalId) {
        require(_urgencyLevel > 0 && _urgencyLevel <= 5, "Invalid urgency level");
        require(organRequests[_requestId].id == 0, "Request ID already exists");

        organRequests[_requestId] = OrganRequest({
            id: _requestId,
            recipient: _recipient,
            organType: _organType,
            bloodType: _bloodType,
            urgencyLevel: _urgencyLevel,
            isActive: true,
            matchedDonor: address(0),
            hospitalId: _hospitalId
        });

        requestIds.push(_requestId);
        emit OrganRequestCreated(_requestId, _organType, _urgencyLevel);
    }

    
    
    function getOrganRequest(uint256 _id) public view returns (OrganRequest memory) {
        return organRequests[_id];
    }

    function getAllRequests() public view returns (OrganRequest[] memory) {
        OrganRequest[] memory allRequests = new OrganRequest[](requestIds.length);
        for (uint256 i = 0; i < requestIds.length; i++) {
            allRequests[i] = organRequests[requestIds[i]];
        }
        return allRequests;
    }


    
    function isOrganAvailable(address _donor, string memory _organ) public view returns (bool) {
        return organStatus[_donor][_organ];
    }






    function matchOrgan(
        uint256 _requestId,
        address _donor
    ) public hospitalExists(organRequests[_requestId].hospitalId) {
        require(msg.sender == hospitals[organRequests[_requestId].hospitalId].owner, "Only hospital owner can match organs");
        require(organRequests[_requestId].isActive, "Request not active");
        require(donors[_donor].isActive, "Donor not active");
        require(donors[_donor].nextOfKinApproval, "Next of kin approval pending");
        require(organStatus[_donor][organRequests[_requestId].organType], "Organ not available");

        OrganRequest storage request = organRequests[_requestId];
        request.matchedDonor = _donor;
        request.isActive = false;

        organStatus[_donor][request.organType] = false;
        hospitals[request.hospitalId].matchingsCompleted++;

        emit OrganMatched(_requestId, _donor, request.recipient);
    }

}