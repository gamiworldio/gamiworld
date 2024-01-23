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

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract GamiTokenDistributor {

    // 131,256,399.938392 GAMI old Total Supply multiplied by 10 ** 12 for 18 decimals
    uint256 public constant MAX_SUPPLY = 131256399938392 * 10 ** 12;

    // 85,531,250 GAMI timelock supply multiplied by 10 ** 18 for 18 decimals
    // Old Time Lock address is : 0x5A0C6d95dcD2Cf23b7a6268b3F5Fdf36F32d4615
    uint256 public constant LOCKED_SUPPLY = 85531250 * 10 ** 18; 
    
    uint256 public constant advisorsLockAmount = 4125000 * 10 ** 18;
    uint256 public constant developmentLockAmount = 6600000 * 10 ** 18;
    uint256 public constant ecosystemGrowthLockAmount = 13950000 * 10 ** 18;
    uint256 public constant marketingLockAmount = 23250000 * 10 ** 18;
    uint256 public constant mergerAcquisitionLockAmount = 13950000 * 10 ** 18;
    uint256 public constant seedLockAmount = 500000 * 10 ** 18;
    uint256 public constant stakingLockAmount = 12375000 * 10 ** 18;
    uint256 public constant teamLockAmount = 10781250 * 10 ** 18;

    uint256 public constant SWAP_CONTRACT_SUPPLY = MAX_SUPPLY - advisorsLockAmount 
    - developmentLockAmount - ecosystemGrowthLockAmount - marketingLockAmount 
    - mergerAcquisitionLockAmount - seedLockAmount - stakingLockAmount - teamLockAmount;

    address public advisorsLockAddress;
    address public developmentLockAddress;
    address public ecosystemGrowthLockAddress;
    address public marketingLockAddress;
    address public mergerAcquisitionLockAddress;
    address public seedLockAddress;
    address public stakingLockAddress;
    address public teamLockAddress;
    address public swapContractAddress;

    address public gamiTokenAddress;
    IERC20 public gamiToken;

    address public immutable initializer;
    bool public isInitialized;

    address[] public addressesToSend;
    mapping(address => uint256) public addressToSendAmounts;

    constructor() {
        initializer = msg.sender;
    }

    function initializeAddressesAndSendTokens(address _gamiToken, address[] calldata _sendingAdresses ) external {
        require(initializer == msg.sender, "Only initializer");
        require(!isInitialized, "Already initialized");
        require(_sendingAdresses.length == 9, "Invalid address count");
        require(_gamiToken != address(0), "Invalid token address");
        for(uint256 i = 0; i < _sendingAdresses.length; i++) {
            require(_sendingAdresses[i] != address(0), "Invalid address");
        }
        gamiTokenAddress = _gamiToken;
        gamiToken = IERC20(gamiTokenAddress);

        require(gamiToken.balanceOf(address(this)) == MAX_SUPPLY, "Max supply not sent to distributor");

        addressesToSend = _sendingAdresses;

        advisorsLockAddress = _sendingAdresses[0];
        addressToSendAmounts[advisorsLockAddress] = advisorsLockAmount;

        developmentLockAddress = _sendingAdresses[1];
        addressToSendAmounts[developmentLockAddress] = developmentLockAmount;

        ecosystemGrowthLockAddress = _sendingAdresses[2];
        addressToSendAmounts[ecosystemGrowthLockAddress] = ecosystemGrowthLockAmount;

        marketingLockAddress = _sendingAdresses[3];
        addressToSendAmounts[marketingLockAddress] = marketingLockAmount;

        mergerAcquisitionLockAddress = _sendingAdresses[4];
        addressToSendAmounts[mergerAcquisitionLockAddress] = mergerAcquisitionLockAmount;

        seedLockAddress = _sendingAdresses[5];
        addressToSendAmounts[seedLockAddress] = seedLockAmount;

        stakingLockAddress = _sendingAdresses[6];
        addressToSendAmounts[stakingLockAddress] = stakingLockAmount;

        teamLockAddress = _sendingAdresses[7];
        addressToSendAmounts[teamLockAddress] = teamLockAmount;

        swapContractAddress = _sendingAdresses[8];
        addressToSendAmounts[swapContractAddress] = SWAP_CONTRACT_SUPPLY;

        sendTokens();   

        require(gamiToken.balanceOf(address(this)) == 0, "Not all tokens sent");
        isInitialized = true;
    }

    function sendTokens() internal {
        for(uint256 i = 0; i < addressesToSend.length; i++) {
            if( i == (addressesToSend.length - 1) ){
                // Last sending account is the swap contract, others are locked accounts
                require(gamiToken.balanceOf(address(this)) == (MAX_SUPPLY - LOCKED_SUPPLY) , "Locked supply not calculated correctly");
            }
            gamiToken.transfer( addressesToSend[i], addressToSendAmounts[addressesToSend[i]]);
        }
    }

}