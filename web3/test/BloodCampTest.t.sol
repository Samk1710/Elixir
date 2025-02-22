// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "forge-std/Test.sol";
import "../src/bloodCamp/BloodCamp.sol";

contract BloodCampTest is Test {
    BloodCamp public bloodCamp;
    address public owner;
    address public addr1;
    address public addr2;

    function setUp() public {
        // Deploy the contract.
        bloodCamp = new BloodCamp();

        // Initialize test addresses.
        owner = address(this); // Test contract is the owner.
        addr1 = address(0x1);
        addr2 = address(0x2);
    }

    function testCreateCamp() public {
        // Create a new camp.
        bloodCamp.createCamp(1, "Camp1", "Org1", "City1", "lat1", "lat2");

        // Retrieve the camp details.
        BloodCamp.Camp memory camp = bloodCamp.getCamp(1);
        uint256 id = camp.id;
        string memory name = camp.name;
        string memory organizer = camp.organizer;
        string memory city = camp.city;
        address campOwner = camp.owner;

        // Assert the camp details.
        assertEq(id, 1);
        assertEq(name, "Camp1");
        assertEq(organizer, "Org1");
        assertEq(city, "City1");
        assertEq(campOwner, owner);
    }

    function testFailCreateCampWithDuplicateId() public {
        // Create a camp with ID 1.
        bloodCamp.createCamp(1, "Camp1", "Org1", "City1", "lat1", "lat2");

        // Attempt to create another camp with the same ID.
        bloodCamp.createCamp(1, "Camp2", "Org2", "City2", "lat1", "lat2");
    }

    function testUpdateInventory() public {
        // Create a camp.
        bloodCamp.createCamp(1, "Camp1", "Org1", "City1", "lat1", "lat2");

        // Update the inventory.
        bloodCamp.updateInventory(1, BloodCamp.BloodType.O_POS, 100);

        // Retrieve the inventory.
        uint256 inventory = bloodCamp.getInventory(1, BloodCamp.BloodType.O_POS);

        // Assert the inventory.
        assertEq(inventory, 100);
    }

    function testFailUpdateInventoryByNonOwner() public {
        // Create a camp.
        bloodCamp.createCamp(1, "Camp1", "Org1", "City1", "lat1", "lat2");

        // Attempt to update the inventory as a non-owner.
        vm.prank(addr1);
        bloodCamp.updateInventory(1, BloodCamp.BloodType.O_POS, 100);
    }

    function testAddRegisteredUser() public {
        // Create a camp.
        bloodCamp.createCamp(1, "Camp1", "Org1", "City1", "lat1", "lat2");

        // Add a registered user.
        bloodCamp.addRegisteredUser(1, addr1);

        // Retrieve the registered users.
        address[] memory users = bloodCamp.getRegisteredUsers(1);

        // Assert the registered user.
        assertEq(users.length, 1);
        assertEq(users[0], addr1);
    }

    function testFailAddRegisteredUserByNonOwner() public {
        // Create a camp.
        bloodCamp.createCamp(1, "Camp1", "Org1", "City1", "lat1", "lat2");

        // Attempt to add a registered user as a non-owner.
        vm.prank(addr1);
        bloodCamp.addRegisteredUser(1, addr1);
    }

    function testAddDonatedUser() public {
        // Create a camp.
        bloodCamp.createCamp(1, "Camp1", "Org1", "City1", "lat1", "lat2");

        // Add a donated user.
        bloodCamp.addDonatedUser(1, addr1);

        // Retrieve the donated users.
        address[] memory users = bloodCamp.getDonatedUsers(1);

        // Assert the donated user.
        assertEq(users.length, 1);
        assertEq(users[0], addr1);
    }

    function testFailAddDonatedUserByNonOwner() public {
        // Create a camp.
        bloodCamp.createCamp(1, "Camp1", "Org1", "City1", "lat1", "lat2");

        // Attempt to add a donated user as a non-owner.
        vm.prank(addr1);
        bloodCamp.addDonatedUser(1, addr1);
    }

    // function testIssueNFT() public {
    //     // Create a camp.
    //     bloodCamp.createCamp(1, "Camp1", "Org1", "City1");

    //     // Issue an NFT to addr1.
    //     bloodCamp.issueNFT(1, addr1);

    //     // Retrieve the NFT contract instance.
    //     BloodCampNFT nftContract = bloodCamp.bloodCampNFT();

    //     // Check if the NFT was minted and transferred to addr1.
    //     uint256 tokenId = 1;
    //     assertEq(nftContract.ownerOf(tokenId), addr1);
    // }

    // function testFailIssueNFTByNonOwner() public {
    //     // Create a camp.
    //     bloodCamp.createCamp(1, "Camp1", "Org1", "City1");

    //     // Attempt to issue an NFT as a non-owner.
    //     vm.prank(addr1);
    //     bloodCamp.issueNFT(1, addr1);
    // }

    function testGetAllCamps() public {
        // Create multiple camps.
        bloodCamp.createCamp(1, "Camp1", "Org1", "City1", "lat1", "lat2");
        bloodCamp.createCamp(2, "Camp2", "Org2", "City2", "long1", "long2");

        // Retrieve all camps.
        BloodCamp.Camp[] memory allCamps = bloodCamp.getAllCamps();

        // Assert the number of camps.
        assertEq(allCamps.length, 2);

        // Assert the details of the first camp.
        assertEq(allCamps[0].id, 1);
        assertEq(allCamps[0].name, "Camp1");
        assertEq(allCamps[0].organizer, "Org1");
        assertEq(allCamps[0].city, "City1");

        // Assert the details of the second camp.
        assertEq(allCamps[1].id, 2);
        assertEq(allCamps[1].name, "Camp2");
        assertEq(allCamps[1].organizer, "Org2");
        assertEq(allCamps[1].city, "City2");
    }

    function testGetInventory() public {
        // Create a camp.
        bloodCamp.createCamp(1, "Camp1", "Org1", "City1", "lat1", "lat2");

        // Update the inventory.
        bloodCamp.updateInventory(1, BloodCamp.BloodType.A_POS, 50);

        // Retrieve the inventory.
        uint256 inventory = bloodCamp.getInventory(1, BloodCamp.BloodType.A_POS);

        // Assert the inventory.
        assertEq(inventory, 50);
    }

    function testGetRegisteredUsers() public {
        // Create a camp.
        bloodCamp.createCamp(1, "Camp1", "Org1", "City1", "lat1", "lat2");

        // Add registered users.
        bloodCamp.addRegisteredUser(1, addr1);
        bloodCamp.addRegisteredUser(1, addr2);

        // Retrieve the registered users.
        address[] memory users = bloodCamp.getRegisteredUsers(1);

        // Assert the registered users.
        assertEq(users.length, 2);
        assertEq(users[0], addr1);
        assertEq(users[1], addr2);
    }

    function testGetDonatedUsers() public {
        // Create a camp.
        bloodCamp.createCamp(1, "Camp1", "Org1", "City1", "lat1", "lat2");

        // Add donated users.
        bloodCamp.addDonatedUser(1, addr1);
        bloodCamp.addDonatedUser(1, addr2);

        // Retrieve the donated users.
        address[] memory users = bloodCamp.getDonatedUsers(1);

        // Assert the donated users.
        assertEq(users.length, 2);
        assertEq(users[0], addr1);
        assertEq(users[1], addr2);
    }
}