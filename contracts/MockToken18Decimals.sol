// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MTK18 is ERC20 {
    constructor() ERC20("MTK18", "MTK18") {
        uint256 _amt = 100000000 * (10**18);

        _mint(msg.sender, _amt);
    }

}
