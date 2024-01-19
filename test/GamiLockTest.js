const { expect } = require("chai");
const { ethers } = require("hardhat");
const { parseEther, formatEther, parseUnits, formatUnits } = require("ethers/utils");

describe("GamiLock", function () {
    let newGamiTokenAddress;
    let newGami;
    let gamiLock, seedLock, teamLock, 
    developmentLock, marketingLock, advisorsLock, 
    stakingLock, ecosystemGrowthLock , mergerAcquisitionLock, lockedUserAddress;
    let owner;
    let lockedUser;
    before(async function () {
        [owner, lockedUser] = await ethers.getSigners();
        [ownerAddress, lockedUserAddress] = await Promise.all([
        owner.getAddress(),
        lockedUser.getAddress(),
        ]);

        const NewGami = await ethers.getContractFactory("MTK18");
        newGami = await NewGami.deploy();
        
        newGamiTokenAddress = await newGami.getAddress();

        // 1 December 2023 00:00:01 GMT  = 1701388801
        const decemberFirstTimestamp = 1701388801;

        // 1 January 2023 00:00:01 GMT  = 1704067201
        const januaryFirstTimestamp = 1704067201;

        //const GamiLock = await ethers.getContractFactory("GamiLock");
        //gamiLock = await GamiLock.deploy(newGamiTokenAddress,lockedUserAddress, 1000, 2500);
        
        const SeedLock = await ethers.getContractFactory("SeedLock");
        seedLock = await SeedLock.deploy(newGamiTokenAddress,lockedUserAddress );
        console.log("seedLock deployed to:", await seedLock.getAddress());
        console.log("Claimable for seedLock = ", formatEther(await seedLock.getClaimable(lockedUserAddress)) );
        
        const TeamLock = await ethers.getContractFactory("TeamLock");
        teamLock = await TeamLock.deploy(newGamiTokenAddress,lockedUserAddress );
        console.log("Claimable for teamLock = ", formatEther(await teamLock.getClaimable(lockedUserAddress)) );
        
        const DevelopmentLock = await ethers.getContractFactory("DevelopmentLock");
        developmentLock = await DevelopmentLock.deploy(newGamiTokenAddress,lockedUserAddress );
        console.log("Claimable for developmentLock = ", formatEther(await developmentLock.getClaimable(lockedUserAddress)) );

        const MarketingLock = await ethers.getContractFactory("MarketingLock");
        marketingLock = await MarketingLock.deploy(newGamiTokenAddress,lockedUserAddress );
        console.log("Claimable for marketingLock = ", formatEther(await marketingLock.getClaimable(lockedUserAddress)) );

        const AdvisorsLock = await ethers.getContractFactory("AdvisorsLock");
        advisorsLock = await AdvisorsLock.deploy(newGamiTokenAddress,lockedUserAddress );
        console.log("Claimable for advisorsLock = ", formatEther(await advisorsLock.getClaimable(lockedUserAddress)) );
       
        const StakingLock = await ethers.getContractFactory("StakingLock");
        stakingLock = await StakingLock.deploy(newGamiTokenAddress,lockedUserAddress );
        console.log("Claimable for stakingLock = ", formatEther(await stakingLock.getClaimable(lockedUserAddress)) );
        
        const EcosystemGrowthLock = await ethers.getContractFactory("EcosystemGrowthLock");
        ecosystemGrowthLock = await EcosystemGrowthLock.deploy(newGamiTokenAddress,lockedUserAddress );
        console.log("Claimable for ecosystemGrowthLock = ", formatEther(await ecosystemGrowthLock.getClaimable(lockedUserAddress)) );
        
        const MergerAcquisitionLock = await ethers.getContractFactory("MergerAcquisitionLock");
        mergerAcquisitionLock = await MergerAcquisitionLock.deploy(newGamiTokenAddress,lockedUserAddress );
        console.log("Claimable for mergerAcquisitionLock = ", formatEther(await mergerAcquisitionLock.getClaimable(lockedUserAddress)) );
    });
    
    
    describe("Lock", function () {
        
        it("Should Locks deployed properly", async function () {
            expect(await seedLock.gamiTokenAddress()).to.equal(newGamiTokenAddress);
            expect(await teamLock.gamiTokenAddress()).to.equal(newGamiTokenAddress);
            expect(await developmentLock.gamiTokenAddress()).to.equal(newGamiTokenAddress);
            expect(await marketingLock.gamiTokenAddress()).to.equal(newGamiTokenAddress);
            expect(await advisorsLock.gamiTokenAddress()).to.equal(newGamiTokenAddress);
            expect(await stakingLock.gamiTokenAddress()).to.equal(newGamiTokenAddress);
            expect(await ecosystemGrowthLock.gamiTokenAddress()).to.equal(newGamiTokenAddress);
            expect(await mergerAcquisitionLock.gamiTokenAddress()).to.equal(newGamiTokenAddress);
        }); 

    });


});