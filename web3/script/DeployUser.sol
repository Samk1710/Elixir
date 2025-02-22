// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {User} from "src/user/User.sol";

contract DeployUser is Script {
    function run() external {
        vm.startBroadcast();
        User user = new User();
        vm.stopBroadcast();
    }
}