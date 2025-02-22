// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BloodCampNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;
    mapping(uint256 => string) private _tokenURIs;

    constructor() ERC721("BloodDonationNFT", "BDNFT") {}

    function mintNFT(address recipient, string memory tokenURI) external onlyOwner returns (uint256) {
        _tokenIds++;
        uint256 newItemId = _tokenIds;
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
        return newItemId;
    }
}

contract BloodCamp {
    struct camp {
        uint256 id;
        string name;
        // organizer
        string organizer;
        // location
        string city;
    }
    
    struct inventory {
        uint256 id;
        uint256 oplus;
        uint256 oneg;
        uint256 aplus;
        uint256 aneg;
        uint256 bplus;
        uint256 bneg;
        uint256 abplus;
        uint256 abneg;
    }

    uint256[] public campIds;

    mapping(address => camp) private camps;
    mapping(uint256 => inventory) private campInventory;
    mapping(uint256 => address[]) private registeredUsers;
    mapping(uint256 => address[]) private donatedUsers;

    function createCamp(
        uint256 _id,
        string memory _name,
        string memory _organizer,
        string memory _city
    ) public {
        // camp storage newCamp = camps[msg.sender];
        camps[msg.sender] = camp( {
            id: _id,
            name: _name,
            organizer: _organizer,
            city: _city
        });

        campIds.push(_id);
    }

    function updateInventory(
        uint256 _id,
        uint256 _oplus,
        uint256 _oneg,
        uint256 _aplus,
        uint256 _aneg,
        uint256 _bplus,
        uint256 _bneg,
        uint256 _abplus,
        uint256 _abneg
    ) public {
        campInventory[_id] = inventory( {
            id: _id,
            oplus: _oplus,
            oneg: _oneg,
            aplus: _aplus,
            aneg: _aneg,
            bplus: _bplus,
            bneg: _bneg,
            abplus: _abplus,
            abneg: _abneg
        });
        // campInventory[_id].oplus += _oplus;
        // campInventory[_id].oneg += _oneg;
        // campInventory[_id].aplus += _aplus;
        // campInventory[_id].aneg += _aneg;
        // campInventory[_id].bplus += _bplus;
        // campInventory[_id].bneg += _bneg;
        // campInventory[_id].abplus += _abplus;
        // campInventory[_id].abneg += _abneg;
    }

    function addRegisteredUsers(uint256 _id, address _user) public {
        registeredUsers[_id].push(_user);
    }

    function addDonatedUsers(uint256 _id, address _user) public {
        donatedUsers[_id].push(_user);
    }

    function getCamp(uint256 id) public view returns (camp memory) {
        return camps[msg.sender]; // logic is wrong, gotta fix this later
    }

    function getAllCamps() public view returns (camp[] memory) {
        camp[] memory allCamps = new camp[](campIds.length);
        for (uint256 i = 0; i < campIds.length; i++) {
            allCamps[i] = camps[msg.sender];
        }
        return allCamps;
    }

    function getInventory(uint256 id) public view returns (inventory memory) {
        return campInventory[id];
    }

    function getRegisteredUsers(uint256 id) public view returns (address[] memory) {
        return registeredUsers[id];
    }

    function getDonatedUsers(uint256 id) public view returns (address[] memory) {
        return donatedUsers[id];
    }

}
