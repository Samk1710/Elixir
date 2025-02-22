// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/organ/OrganDonation.sol";

contract OrganDonationTest is Test {
    OrganDonation public organDonation;
    OrganDonationNFT public nft;
    
    address public owner;
    address public hospital;
    address public donor;
    address public recipient;
    address public nextOfKin;
    address public unauthorized;

    string[] organs;

    function setUp() public {
        // Deploy contract
        organDonation = new OrganDonation();
        nft = OrganDonationNFT(organDonation.organDonationNFT());
        
        // Setup test addresses
        owner = address(this);
        hospital = makeAddr("hospital");
        donor = makeAddr("donor");
        recipient = makeAddr("recipient");
        nextOfKin = makeAddr("nextOfKin");
        unauthorized = makeAddr("unauthorized");

        // Setup test organs array
        organs.push("kidney");
        organs.push("liver");

        // Fund addresses
        vm.deal(hospital, 100 ether);
        vm.deal(donor, 100 ether);
        vm.deal(nextOfKin, 100 ether);
    }

    modifier hospitalRegistered() {
        vm.prank(hospital);
        organDonation.registerHospital(1, "City Hospital", "New York");

        OrganDonation.Hospital memory hospitalData = organDonation.getHospital(1);
        _;
    }

    // Hospital Registration Tests
    function testHospitalRegistration() public {
        // vm.prank(hospital);
        // organDonation.registerHospital(1, "City Hospital", "New York");

        OrganDonation.Hospital memory hospitalData = organDonation.getHospital(1);

        assertEq(hospitalData.id, 1);
        assertEq(hospitalData.name, "City Hospital");
        assertEq(hospitalData.city, "New York");
        assertEq(hospitalData.owner, hospital);
        // assertEq(hospitalData.isVerified, false);
        assertEq(hospitalData.matchingsCompleted, 0);
    }


    function testFailDuplicateHospitalId() public {
        vm.startPrank(hospital);
        organDonation.registerHospital(1, "City Hospital", "New York");
        organDonation.registerHospital(1, "Another Hospital", "Boston");
        vm.stopPrank();
    }

    // Hospital Verification Tests
    // function testHospitalVerification() public hospitalRegistered{
    //     OrganDonation.Hospital memory hospitalData = organDonation.getHospital(1);
    //     organDonation.verifyHospital(1);
        
    //     // (, , , , bool isVerified, ) = organDonation.getHospital(1);
    //     assertTrue(hospitalData.isVerified);
    // }

    // function testFailUnauthorizedHospitalVerification() public {
    //     vm.prank(hospital);
    //     organDonation.registerHospital(1, "City Hospital", "New York");
        
    //     vm.prank(unauthorized);
    //     vm.expectRevert();
    //     organDonation.verifyHospital(1);
    // }

    // Donor Registration Tests
    function testDonorRegistration() public {
        vm.prank(donor);
        organDonation.registerDonor(organs, nextOfKin, "ipfs_hash");

        (
            string[] memory registeredOrgans,
            address registeredNextOfKin,
            bool isActive,
            bool nextOfKinApproval,
            string memory ipfsHash
        ) = organDonation.getDonor(donor);

        assertEq(registeredOrgans.length, organs.length);
        assertEq(registeredOrgans[0], organs[0]);
        assertEq(registeredOrgans[1], organs[1]);
        assertEq(registeredNextOfKin, nextOfKin);
        assertTrue(isActive);
        assertFalse(nextOfKinApproval);
        assertEq(ipfsHash, "ipfs_hash");
    }

    function testDonorNFTMinting() public {
        vm.prank(donor);
        organDonation.registerDonor(organs, nextOfKin, "ipfs_hash");

        assertEq(nft.balanceOf(donor), 1);
    }

    function testFailInvalidNextOfKin() public {
        vm.prank(donor);
        organDonation.registerDonor(organs, address(0), "ipfs_hash");
    }

    // Next of Kin Approval Tests
    function testNextOfKinApproval() public {
        vm.prank(donor);
        organDonation.registerDonor(organs, nextOfKin, "ipfs_hash");

        vm.prank(nextOfKin);
        organDonation.approveAsDonor(donor);

        (, , , bool approval, ) = organDonation.getDonor(donor);
        assertTrue(approval);
    }

    function testFailUnauthorizedNextOfKinApproval() public {
        vm.prank(donor);
        organDonation.registerDonor(organs, nextOfKin, "ipfs_hash");

        vm.prank(unauthorized);
        vm.expectRevert();
        organDonation.approveAsDonor(donor);
    }

    // Organ Request Tests
    function testCreateOrganRequest() public {
        // Setup verified hospital
        vm.prank(hospital);
        organDonation.registerHospital(1, "City Hospital", "New York");
        // organDonation.verifyHospital(1);

        // Create request
        vm.prank(hospital);
        organDonation.createOrganRequest(
            1,              // hospitalId
            1,              // requestId
            "kidney",       // organType
            "A+",          // bloodType
            3,             // urgencyLevel
            recipient      // recipient
        );

        OrganDonation.OrganRequest memory request = organDonation.getOrganRequest(1);
        assertEq(request.id, 1);
        assertEq(request.organType, "kidney");
        assertEq(request.bloodType, "A+");
        assertEq(request.urgencyLevel, 3);
        assertEq(request.recipient, recipient);
        assertTrue(request.isActive);
        assertEq(request.matchedDonor, address(0));
        assertEq(request.hospitalId, 1);
    }

    function testFailCreateRequestUnverifiedHospital() public {
        vm.prank(hospital);
        organDonation.registerHospital(1, "City Hospital", "New York");

        vm.prank(hospital);
        vm.expectRevert();
        organDonation.createOrganRequest(1, 1, "kidney", "A+", 3, recipient);
    }

    function testFailInvalidUrgencyLevel() public {
        vm.prank(hospital);
        organDonation.registerHospital(1, "City Hospital", "New York");
        // organDonation.verifyHospital(1);

        vm.prank(hospital);
        vm.expectRevert();
        organDonation.createOrganRequest(1, 1, "kidney", "A+", 6, recipient);
    }

    // Organ Matching Tests
    function testSuccessfulOrganMatch() public hospitalRegistered{
        // Setup hospital
        // vm.prank(hospital);
        // organDonation.registerHospital(1, "City Hospital", "New York");
        OrganDonation.Hospital memory hospitalData = organDonation.getHospital(1);
        // organDonation.verifyHospital(1);

        // Setup donor
        vm.prank(donor);
        organDonation.registerDonor(organs, nextOfKin, "ipfs_hash");

        // Next of kin approval
        vm.prank(nextOfKin);
        organDonation.approveAsDonor(donor);

        // Create request
        vm.prank(hospital);
        organDonation.createOrganRequest(1, 1, "kidney", "A+", 3, recipient);

        // Match organ
        vm.prank(hospital);
        organDonation.matchOrgan(1, donor);

        OrganDonation.OrganRequest memory request = organDonation.getOrganRequest(1);
        assertEq(request.matchedDonor, donor);
        assertFalse(request.isActive);
        assertFalse(organDonation.isOrganAvailable(donor, "kidney"));

        // (, , , , uint256 matchings) = organDonation.getHospital(1);
        assertEq(hospitalData.matchingsCompleted, 1);
    }

    function testFailMatchWithoutNextOfKinApproval() public {
        // Setup hospital
        vm.prank(hospital);
        organDonation.registerHospital(1, "City Hospital", "New York");
        // organDonation.verifyHospital(1);

        // Setup donor without next of kin approval
        vm.prank(donor);
        organDonation.registerDonor(organs, nextOfKin, "ipfs_hash");

        // Create request
        vm.prank(hospital);
        organDonation.createOrganRequest(1, 1, "kidney", "A+", 3, recipient);

        // Try to match organ
        vm.prank(hospital);
        vm.expectRevert();
        organDonation.matchOrgan(1, donor);
    }

    // Getter Function Tests
    function testGetAllHospitals() public {
        vm.startPrank(hospital);
        organDonation.registerHospital(1, "Hospital 1", "New York");
        organDonation.registerHospital(2, "Hospital 2", "Boston");
        vm.stopPrank();

        OrganDonation.Hospital[] memory allHospitals = organDonation.getAllHospitals();
        assertEq(allHospitals.length, 2);
        assertEq(allHospitals[0].name, "Hospital 1");
        assertEq(allHospitals[1].name, "Hospital 2");
    }

    function testGetAllRequests() public {
        // Setup hospital
        vm.prank(hospital);
        organDonation.registerHospital(1, "City Hospital", "New York");
        // organDonation.verifyHospital(1);

        // Create multiple requests
        vm.startPrank(hospital);
        organDonation.createOrganRequest(1, 1, "kidney", "A+", 3, recipient);
        organDonation.createOrganRequest(1, 2, "liver", "B+", 4, recipient);
        vm.stopPrank();

        OrganDonation.OrganRequest[] memory allRequests = organDonation.getAllRequests();
        assertEq(allRequests.length, 2);
        assertEq(allRequests[0].organType, "kidney");
        assertEq(allRequests[1].organType, "liver");
    }

    function testOrganAvailability() public {
        vm.prank(donor);
        organDonation.registerDonor(organs, nextOfKin, "ipfs_hash");

        assertTrue(organDonation.isOrganAvailable(donor, "kidney"));
        assertTrue(organDonation.isOrganAvailable(donor, "liver"));
        assertFalse(organDonation.isOrganAvailable(donor, "heart")); // Not registered
    }

    // Fuzz Tests
    function testFuzz_HospitalRegistration(
        uint256 id,
        string memory name,
        string memory city
    ) public {
        vm.assume(id != 0);
        vm.assume(bytes(name).length > 0);
        vm.assume(bytes(city).length > 0);

        vm.prank(hospital);
        organDonation.registerHospital(id, name, city);

        OrganDonation.Hospital memory hospitalData = organDonation.getHospital(1);

        assertEq(hospitalData.id, id);
        assertEq(hospitalData.name, name);
        assertEq(hospitalData.city, city);
    }

    function testFuzz_OrganRequest(
        uint256 hospitalId,
        uint256 requestId,
        string memory organType,
        string memory bloodType,
        uint256 urgencyLevel
    ) public {
        vm.assume(hospitalId != 0);
        vm.assume(requestId != 0);
        vm.assume(bytes(organType).length > 0);
        vm.assume(bytes(bloodType).length > 0);
        vm.assume(urgencyLevel > 0 && urgencyLevel <= 5);

        vm.prank(hospital);
        organDonation.registerHospital(hospitalId, "Test Hospital", "Test City");
        // organDonation.verifyHospital(hospitalId);

        vm.prank(hospital);
        organDonation.createOrganRequest(
            hospitalId,
            requestId,
            organType,
            bloodType,
            urgencyLevel,
            recipient
        );

        OrganDonation.OrganRequest memory request = organDonation.getOrganRequest(requestId);
        assertEq(request.id, requestId);
        assertEq(request.organType, organType);
        assertEq(request.bloodType, bloodType);
        assertEq(request.urgencyLevel, urgencyLevel);
    }
}