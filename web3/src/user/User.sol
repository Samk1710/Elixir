
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract User {
    struct user{
        string name;
        address userAddress;
    }

    mapping(address => user) private users;

    function createUser(string memory _name) public {
        users[msg.sender] = user(_name, msg.sender);
    }

    function getUser() public view returns (string memory, address) {
        return (users[msg.sender].name, users[msg.sender].userAddress);
    }
}
