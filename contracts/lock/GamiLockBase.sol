// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @title GamiLock
/// @dev Implements a token vesting mechanism where tokens are locked and released linearly over time.
/// @notice This contract is used to manage the vesting of tokens, allowing users to claim their vested tokens over a period.
contract GamiLock is ReentrancyGuard {

    mapping(address => LockInfo) public userToLockInfo;

    address public immutable gamiTokenAddress;
    uint256 public constant period = 30 days;
    uint256 public releaseRate;
    uint256 public constant baseRate = 10000000;
    uint256 public constant lockStartTime = 1701388801;

    event ReleaseInfoSet(uint256 startTime, uint256 rate);
    event Claimed(address indexed user, uint256 timestamp, uint256 claimedAmount, 
    uint256 totalClaimed, uint256 totalAmount);
    event TokensLocked(address indexed user, uint256 timestamp, uint256 amount);

    error NothingToClaim();

    struct LockInfo {
        uint256 totalAmount;
        uint256 totalClaimed;
    }

    constructor(address _gamiAddress, address _lockUser,
    uint256 _lockAmount, uint256 _rate ) {

        require (_gamiAddress != address(0) , "Invalid address") ;
        gamiTokenAddress = _gamiAddress;
        lockTokens(_lockUser, _lockAmount);
        setReleaseInfo(_rate);

    }

    function setReleaseInfo( uint256 _rate) internal {
        require(_rate > 0 , "Value must be greater than zero.");
        releaseRate = _rate;
        emit ReleaseInfoSet(lockStartTime, _rate);
    }

    function lockTokens(address _user, uint256 _amt) internal {
        LockInfo storage info = userToLockInfo[_user];
        info.totalAmount += _amt;
        emit TokensLocked(_user, block.timestamp,_amt);
    }

    function getClaimable(address _user) public view returns (uint256) {
        LockInfo memory info = userToLockInfo[_user];
        if (info.totalClaimed == info.totalAmount || lockStartTime == 0 || block.timestamp < lockStartTime) {
            return 0;
        }
        uint256 timePassed = block.timestamp - lockStartTime;
        uint256 periodsPassed = timePassed / period;
        if (periodsPassed == 0) {
            return 0;
        }
        uint256 totalClaimableSoFar = info.totalAmount * releaseRate * periodsPassed / baseRate;
        if (totalClaimableSoFar > info.totalAmount) {
            totalClaimableSoFar = info.totalAmount;
        }
        return totalClaimableSoFar - info.totalClaimed;
    }

    function claim() external nonReentrant {
        uint256 claimable = getClaimable(msg.sender);
        if (claimable == 0) {
            revert NothingToClaim();
        }
        LockInfo storage info = userToLockInfo[msg.sender];
        info.totalClaimed = info.totalClaimed + claimable;
        IERC20 gami = IERC20(gamiTokenAddress);
        gami.transfer(msg.sender, claimable);
        emit Claimed(msg.sender, block.timestamp, claimable, info.totalClaimed, info.totalAmount);
    }
}
