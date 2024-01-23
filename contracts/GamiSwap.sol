// SPDX-License-Identifier: MIT
/*  


                                                                                            
                                   *##########################(                            
                                   *&&&&&&&&&&&&&&&&&&&&&&&&&&(                            
                                   *&&&&&&&&&&&&&&&&&&&&&&&&&&(                            
                                   *&&&&&&&&&&&&&&&&&&&&&&&&&&(                            
                                   *&&&&&&&&&&&&&&&&&&&&&&&&&&(                            
                                   *&&&&&&&&&&&&&&&&&&&&&&&&&&*                            
                      %&&&&&&&&&&&&&*                                                      
                      %&&&&&&&&&&&&&*                                                      
                      %&&&&&&&&&&&&&*                                                      
                      %&&&&&&&&&&&&&*                                                      
                      %&&&&&&&&&&&&&*                                                      
                      %&&&&&&&&&&&&&*           /&&&&&&&&&&&&&&&&&&&&&&&&&&*               
                      %&&&&&&&&&&&&&*           /&&&&&&&&&&&&&&&&&&&&&&&&&&*               
                      %&&&&&&&&&&&&&*           /&&&&&&&&&&&&&&&&&&&&&&&&&&*               
                      %&&&&&&&&&&&&&*           /&&&&&&&&&&&&&&&&&&&&&&&&&&*               
                      %&&&&&&&&&&&&&*           /&&&&&&&&&&&&&&&&&&&&&&&&&&*               
                      %&&&&&&&&&&&&&*            *************&&&&&&&&&&&&&*               
                      %&&&&&&&&&&&&&*                         &&&&&&&&&&&&&*               
                      %&&&&&&&&&&&&&*                         &&&&&&&&&&&&&*               
                      %&&&&&&&&&&&&&*                         &&&&&&&&&&&&&*               
                      %&&&&&&&&&&&&&*                         &&&&&&&&&&&&&*               
                      %%&&&&&&&&&&&&%////////////////////////%&%&&&&&&&&&&%*               
                                   *&&&&&&&&&&&&&&&&&&&&&&&&&&*                            
                                   *&&&&&&&&&&&&&&&&&&&&&&&&&&*                            
                                   *&&&&&&&&&&&&&&&&&&&&&&&&&&*                            
                                   *&&&&&&&&&&&&&&&&&&&&&&&&&&*                            
                                   *&&&&&&&&&&&&&&&&&&&&&&&&&&*                            
                                                                                           
                                                                                           
                                                                                           
                                                                                           
                                                                                           
                                                                                           
                                                                                           
         .###############.         ###############        ####(            *####      ####%
        &&&&&&&&&&&&&&&&&&%      #&&&&&&&&&&&&&&&&&&      %&&&&&#        (&&&&&&      &&&&%
        &&&%*                    #&&&           /&&&      %&&&&&&&#.   /&&&&&&&&      &&&&%
        &&&%*                    #&&&           /&&&      %&&&//&&&&%#&&&&#*%&&&      &&&&%
        &&&%*      %&&&&&&&      #&&&&&&&&&&&&&&&&&&      %&&&   *&&&&&&/.  %&&&      &&&&%
        &&&%*          #&&&      #&&&%%%%%%%%%%%%&&&      %&&&     *&&(     %&&&      &&&&%
        &&&%&&&&&&&&&&&%&&&      #&&&           /&&&      %&&&              %&&&      &&&&%
        &&&&&&&&&&&&&&&&&&#      #&&&           /&&&      %&&&              %&&&      &&&&%
       

@author : Baris Arya Cantepe        
*/
pragma solidity ^0.8.17;

import {IERC20, SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract GamiSwap is ReentrancyGuard  {
    using SafeERC20 for IERC20;

    address public immutable oldGamiTokenAddress ; 
    address public immutable newGamiTokenAddress ;

    IERC20 oldGami;
    IERC20 newGami;

    uint256 public totalSwapped;
    mapping(address => uint256) public addressToSwappedAmount;

    event Swapped(address swapper, uint256 amount, uint256 timestamp, uint256 totalSwappedAmount);

    constructor(address _oldGamiTokenAddress, address _newGamiTokenAddress) {
        oldGamiTokenAddress = _oldGamiTokenAddress;
        oldGami = IERC20(oldGamiTokenAddress);

        newGamiTokenAddress = _newGamiTokenAddress;
        newGami = IERC20(newGamiTokenAddress);
    }

    function swap(uint256 amount6Decimals) public nonReentrant {
        require (amount6Decimals > 0 , "Zero amount swap not allowed.");
        require(oldGami.balanceOf(msg.sender) >= amount6Decimals , "Unsufficent balance");

        uint256 amount18Decimals = amount6Decimals * 10 ** 12;
        require(amount18Decimals <= newGami.balanceOf(address(this)), "Not enough balance in contract");

        oldGami.safeTransferFrom(msg.sender, address(this), amount6Decimals);
        newGami.safeTransfer(msg.sender, amount18Decimals);

        totalSwapped += amount18Decimals;
        addressToSwappedAmount[msg.sender] += amount18Decimals;

        emit Swapped(msg.sender, amount18Decimals, block.timestamp, totalSwapped);
        
    }
}