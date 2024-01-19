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

import {GamiLock} from "./GamiLockBase.sol";

/// @title MergerAcquisitionLock
/// @dev Implements a token vesting mechanism where tokens are locked and released linearly over time.
/// @notice This contract is used to manage the vesting of tokens, allowing users to claim their vested tokens over a period.
contract MergerAcquisitionLock is GamiLock {

    /// @notice Constructor to initialize. MergerAcquisitionLock total amount is 13,950,000 GAMI, remaining vesting 93 months.
    /// @dev The constructor takes of GAMI, locking address, total lock amount and the release rate based 10,000,000
    /// @param _gamiAddress Address of the Gami token contract
    /// @param _lockUser Address of the user whose tokens are to be locked
    constructor(address _gamiAddress, address _lockUser) 
        GamiLock(_gamiAddress, 
        _lockUser,
        13950000 * 10 ** 18,
        107527
        ) {
    }
}