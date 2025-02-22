// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {BloodCamp} from "src/bloodCamp/BloodCamp.sol";

contract DeployBloodCamp is Script {
    function run() external {
        vm.startBroadcast();
        BloodCamp bloodCamp = new BloodCamp();
        vm.stopBroadcast();
    }
}