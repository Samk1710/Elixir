// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/organ/Organ.sol";

contract OrganTest is Test {
    Organ organ;
    address owner;
    address donor;
    address hospital;
    address nextOfKin;

    function setUp() public {
        // Deploy the contract
        organ = new Organ();

        // Initialize addresses
        owner = address(this); // Test contract is the owner
        donor = address(0x1);
        hospital = address(0x2);
        nextOfKin = address(0x3);
    }

    function testDonorRegistration() public {
        // Register a donor
        string[] memory organsList = new string[](2);
        organsList[0] = "Heart";
        organsList[1] = "Liver";
        string memory ipfsHash = "QmExampleHash";

        vm.prank(donor);
        organ.registerAsDonor(organsList, nextOfKin, ipfsHash);

        // Check donor details
        string[] memory donorOrgans = organ.getDonorOrgans(donor);
        assertEq(donorOrgans.length, 2);
        assertEq(donorOrgans[0], "Heart");
        assertEq(donorOrgans[1], "Liver");

        // Check NFT minting
        uint256 tokenId = 0;
        assertEq(organ.ownerOf(tokenId), donor);
    }

    function testDonorRegistrationFailInvalidNextOfKin() public {
        // Attempt to register with zero address as next of kin
        string[] memory organsList = new string[](2);
        organsList[0] = "Heart";
        organsList[1] = "Liver";
        string memory ipfsHash = "QmExampleHash";

        vm.prank(donor);
        vm.expectRevert("Invalid next of kin address");
        organ.registerAsDonor(organsList, address(0), ipfsHash);
    }

    function testDonorRegistrationFailEmptyOrgansList() public {
        // Attempt to register with an empty organs list
        string[] memory organsList = new string[](0);
        string memory ipfsHash = "QmExampleHash";

        vm.prank(donor);
        vm.expectRevert("At least one organ must be specified");
        organ.registerAsDonor(organsList, nextOfKin, ipfsHash);
    }

    // function testNextOfKinApproval() public {
    //     // Register a donor
    //     string[] memory organsList = new string[](2);
    //     organsList[0] = "Heart";
    //     organsList[1] = "Liver";
    //     string memory ipfsHash = "QmExampleHash";

    //     vm.prank(donor);
    //     organ.registerAsDonor(organsList, nextOfKin, ipfsHash);

    //     // Approve as next of kin
    //     vm.prank(nextOfKin);
    //     organ.approveAsDonor(donor);

    //     // Check approval status
    //     (,,,, bool nextOfKinApproval,) = organ.donors(donor);
    //     assertTrue(nextOfKinApproval);
    // }

    function testNextOfKinApprovalFailUnauthorized() public {
        // Register a donor
        string[] memory organsList = new string[](2);
        organsList[0] = "Heart";
        organsList[1] = "Liver";
        string memory ipfsHash = "QmExampleHash";

        vm.prank(donor);
        organ.registerAsDonor(organsList, nextOfKin, ipfsHash);

        // Attempt to approve as a non-next of kin
        vm.prank(hospital);
        vm.expectRevert("Not authorized next of kin");
        organ.approveAsDonor(donor);
    }

    function testHospitalVerification() public {
        // Verify the hospital
        organ.verifyHospital(hospital);

        // Check hospital verification status
        (bool isVerified,,) = organ.hospitals(hospital);
        assertTrue(isVerified);
    }

    function testHospitalVerificationFailNonOwner() public {
        // Attempt to verify a hospital as a non-owner
        vm.prank(donor);
        vm.expectRevert("Ownable: caller is not the owner");
        organ.verifyHospital(hospital);
    }

    function testOrganRequestAndMatching() public {
        // Register a donor and approve them
        string[] memory organsList = new string[](2);
        organsList[0] = "Heart";
        organsList[1] = "Liver";
        string memory ipfsHash = "QmExampleHash";

        vm.prank(donor);
        organ.registerAsDonor(organsList, nextOfKin, ipfsHash);

        vm.prank(nextOfKin);
        organ.approveAsDonor(donor);

        // Verify the hospital
        organ.verifyHospital(hospital);

        // Create an organ request
        vm.prank(hospital);
        organ.createOrganRequest(donor, "Heart", "O+", Organ.UrgencyLevel.Critical);

        // Match the organ
        vm.prank(hospital);
        organ.matchOrgan(0, donor);

        // Check request status
        (,,,, bool isActive, address matchedDonor,) = organ.getOrganRequest(0);
        assertFalse(isActive);
        assertEq(matchedDonor, donor);

        // Check donor's organ status
        bool isOrganAvailable = organ.isOrganAvailable(donor, "Heart");
        assertFalse(isOrganAvailable);
    }

    function testOrganRequestFailUnauthorizedHospital() public {
        // Attempt to create an organ request as an unverified hospital
        vm.prank(hospital);
        vm.expectRevert("Not a verified hospital");
        organ.createOrganRequest(donor, "Heart", "O+", Organ.UrgencyLevel.Critical);
    }

    function testOrganMatchingFailUnauthorizedHospital() public {
        // Register a donor and approve them
        string[] memory organsList = new string[](2);
        organsList[0] = "Heart";
        organsList[1] = "Liver";
        string memory ipfsHash = "QmExampleHash";

        vm.prank(donor);
        organ.registerAsDonor(organsList, nextOfKin, ipfsHash);

        vm.prank(nextOfKin);
        organ.approveAsDonor(donor);

        // Verify the hospital
        organ.verifyHospital(hospital);

        // Create an organ request
        vm.prank(hospital);
        organ.createOrganRequest(donor, "Heart", "O+", Organ.UrgencyLevel.Critical);

        // Attempt to match the organ as an unverified hospital
        vm.prank(donor);
        vm.expectRevert("Not a verified hospital");
        organ.matchOrgan(0, donor);
    }

    function testOrganMatchingFailInactiveDonor() public {
        // Register a donor but do not approve them
        string[] memory organsList = new string[](2);
        organsList[0] = "Heart";
        organsList[1] = "Liver";
        string memory ipfsHash = "QmExampleHash";

        vm.prank(donor);
        organ.registerAsDonor(organsList, nextOfKin, ipfsHash);

        // Verify the hospital
        organ.verifyHospital(hospital);

        // Create an organ request
        vm.prank(hospital);
        organ.createOrganRequest(donor, "Heart", "O+", Organ.UrgencyLevel.Critical);

        // Attempt to match the organ with an inactive donor
        vm.prank(hospital);
        vm.expectRevert("Donor not active");
        organ.matchOrgan(0, donor);
    }
}