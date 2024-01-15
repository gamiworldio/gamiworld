// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MTK6 is ERC20 {
    constructor() ERC20("MTK6", "MTK6") {
        uint256 _amt = 100000000 * (10**18);

        _mint(msg.sender, _amt);
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }
}
