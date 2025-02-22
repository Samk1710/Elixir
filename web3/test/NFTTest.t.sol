// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "forge-std/Test.sol";
import "../src/bloodCamp/BloodCamp.sol";

contract BloodCampNFTTest is Test {
    BloodCampNFT private nft;
    address private owner = address(this);
    address private user1 = address(0x123);
    address private user2 = address(0x456);

    function setUp() public {
        nft = new BloodCampNFT();
    }

    function testMintNFT() public {
        string memory tokenURI = "ipfs://example_token_uri_1";
        uint256 tokenId = nft.mint(user1, tokenURI);

        assertEq(nft.ownerOf(tokenId), user1);
        assertEq(nft.tokenURI(tokenId), tokenURI);
    }

    function testFailMintByNonOwner() public {
        vm.prank(user2); // Simulating a different user calling the function
        nft.mint(user1, "ipfs://not_allowed_uri"); // Should revert
    }

    function testTokenURI() public {
        string memory tokenURI = "ipfs://example_token_uri_2";
        uint256 tokenId = nft.mint(user1, tokenURI);
        
        assertEq(nft.tokenURI(tokenId), tokenURI);
    }

    function testSetTokenURI() public {
        string memory newTokenURI = "ipfs://new_uri";
        uint256 tokenId = nft.mint(user1, "ipfs://old_uri");

        nft.setTokenURI(tokenId, newTokenURI);

        assertEq(nft.tokenURI(tokenId), newTokenURI);
    }

    function testFailSetTokenURIForNonexistentToken() public {
        nft.setTokenURI(9999, "ipfs://invalid_uri"); // Should revert
    }
}
