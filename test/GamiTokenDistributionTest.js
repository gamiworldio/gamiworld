const { expect } = require("chai");
const { ethers } = require("hardhat");
const { parseEther, formatEther, parseUnits, formatUnits } = require("ethers/utils");

describe("GamiLock", function () {
    let gamiTokenDistributorAddress, gamiTokenDistributor;
    let gami, gamiTokenAddress;
    let oldGamiTokenAddress = "0x1236a887ef31b4d32e1f0a2b5e4531f52cec7e75";
    let gamiSwap, gamiSwapAddress;
    let seedLock, teamLock, 
    developmentLock, marketingLock, advisorsLock, 
    stakingLock, ecosystemGrowthLock , mergerAcquisitionLock, lockedUserAddress;
    let lockContracts = [];
    let owner;
    let lockedUser;

    let advisorsLockBalance, developmentLockBalance, ecosystemGrowthLockBalance, 
    marketingLockBalance, mergerAcquisitionLockBalance, seedLockBalance, stakingLockBalance, teamLockBalance, gamiSwapBalance;
    before(async function () {
        [owner, lockedUser] = await ethers.getSigners();
        [ownerAddress, lockedUserAddress] = await Promise.all([
        owner.getAddress(),
        lockedUser.getAddress(),
        ]);


        const GamiTokenDistributor = await ethers.getContractFactory("GamiTokenDistributor");
        gamiTokenDistributor = await GamiTokenDistributor.deploy();
        gamiTokenDistributorAddress = await gamiTokenDistributor.getAddress();
        console.log("gamiTokenDistributor deployed to:", await gamiTokenDistributor.getAddress());
        console.log("Swap contract supply for gamiTokenDistributor = ", formatEther(await gamiTokenDistributor.SWAP_CONTRACT_SUPPLY()) );

        const GamiToken = await ethers.getContractFactory("GamiWorldV2");
        gami = await GamiToken.deploy(gamiTokenDistributorAddress);
        gamiTokenAddress = await gami.getAddress();
        console.log("gami deployed to:", await gami.getAddress());
        
        const AdvisorsLock = await ethers.getContractFactory("AdvisorsLock");
        advisorsLock = await AdvisorsLock.deploy(gamiTokenAddress,lockedUserAddress );
        console.log("Claimable for advisorsLock = ", formatEther(await advisorsLock.getClaimable(lockedUserAddress)) );
        lockContracts.push(await advisorsLock.getAddress());
        
        const DevelopmentLock = await ethers.getContractFactory("DevelopmentLock");
        developmentLock = await DevelopmentLock.deploy(gamiTokenAddress,lockedUserAddress );
        console.log("Claimable for developmentLock = ", formatEther(await developmentLock.getClaimable(lockedUserAddress)) );
        lockContracts.push(await developmentLock.getAddress());
        
        const EcosystemGrowthLock = await ethers.getContractFactory("EcosystemGrowthLock");
        ecosystemGrowthLock = await EcosystemGrowthLock.deploy(gamiTokenAddress,lockedUserAddress );
        console.log("Claimable for ecosystemGrowthLock = ", formatEther(await ecosystemGrowthLock.getClaimable(lockedUserAddress)) );
        lockContracts.push(await ecosystemGrowthLock.getAddress());

        const MarketingLock = await ethers.getContractFactory("MarketingLock");
        marketingLock = await MarketingLock.deploy(gamiTokenAddress,lockedUserAddress );
        console.log("Claimable for marketingLock = ", formatEther(await marketingLock.getClaimable(lockedUserAddress)) );
        lockContracts.push(await marketingLock.getAddress());
        
        const MergerAcquisitionLock = await ethers.getContractFactory("MergerAcquisitionLock");
        mergerAcquisitionLock = await MergerAcquisitionLock.deploy(gamiTokenAddress,lockedUserAddress );
        console.log("Claimable for mergerAcquisitionLock = ", formatEther(await mergerAcquisitionLock.getClaimable(lockedUserAddress)) );
        lockContracts.push(await mergerAcquisitionLock.getAddress());

        const SeedLock = await ethers.getContractFactory("SeedLock");
        seedLock = await SeedLock.deploy(gamiTokenAddress,lockedUserAddress );
        console.log("seedLock deployed to:", await seedLock.getAddress());
        console.log("Claimable for seedLock = ", formatEther(await seedLock.getClaimable(lockedUserAddress)) );
        lockContracts.push(await seedLock.getAddress());
        
        const StakingLock = await ethers.getContractFactory("StakingLock");
        stakingLock = await StakingLock.deploy(gamiTokenAddress,lockedUserAddress );
        console.log("Claimable for stakingLock = ", formatEther(await stakingLock.getClaimable(lockedUserAddress)) );
        lockContracts.push(await stakingLock.getAddress());

        const TeamLock = await ethers.getContractFactory("TeamLock");
        teamLock = await TeamLock.deploy(gamiTokenAddress,lockedUserAddress );
        console.log("Claimable for teamLock = ", formatEther(await teamLock.getClaimable(lockedUserAddress)) );
        lockContracts.push(await teamLock.getAddress());
        
        const GamiSwap = await ethers.getContractFactory("GamiSwap");
        gamiSwap = await GamiSwap.deploy(oldGamiTokenAddress, gamiTokenAddress);
        gamiSwapAddress = await gamiSwap.getAddress();
        lockContracts.push(await gamiSwap.getAddress());
        console.log("GamiSwap deployed to:", await gamiSwap.getAddress());
        
        let sendTx = await gamiTokenDistributor.initializeAddressesAndSendTokens(gamiTokenAddress, lockContracts);
        await sendTx.wait();
    });
    
    
    describe("Lock", function () {
        
        it("Should Locks deployed properly", async function () {
            expect(await gamiTokenDistributor.getAddress()).to.equal(gamiTokenDistributorAddress);
        }); 

        it("Should unlocked amounts be equal", async function () {
            expect(await gamiTokenDistributor.SWAP_CONTRACT_SUPPLY()).to.equal(await gamiTokenDistributor.MAX_SUPPLY() - await gamiTokenDistributor.LOCKED_SUPPLY());
        }); 

        it("Should lock contract balances equal with locked amounts", async function () {
            advisorsLockBalance = await gami.balanceOf(await advisorsLock.getAddress());
            console.log("AdvisorsLock balance = ", formatEther(advisorsLockBalance) );
            expect(advisorsLockBalance).to.equal(await gamiTokenDistributor.advisorsLockAmount());

            developmentLockBalance = await gami.balanceOf(await developmentLock.getAddress());
            console.log("DevelopmentLock balance = ", formatEther(developmentLockBalance) );
            expect(developmentLockBalance).to.equal(await gamiTokenDistributor.developmentLockAmount());

            ecosystemGrowthLockBalance = await gami.balanceOf(await ecosystemGrowthLock.getAddress());
            console.log("EcosystemGrowthLock balance = ", formatEther(ecosystemGrowthLockBalance) );
            expect(ecosystemGrowthLockBalance).to.equal(await gamiTokenDistributor.ecosystemGrowthLockAmount());

            marketingLockBalance = await gami.balanceOf(await marketingLock.getAddress());
            console.log("MarketingLock balance = ", formatEther(marketingLockBalance) );
            expect(marketingLockBalance).to.equal(await gamiTokenDistributor.marketingLockAmount());

            mergerAcquisitionLockBalance = await gami.balanceOf(await mergerAcquisitionLock.getAddress());
            console.log("MergerAcquisitionLock balance = ", formatEther(mergerAcquisitionLockBalance) );
            expect(mergerAcquisitionLockBalance).to.equal(await gamiTokenDistributor.mergerAcquisitionLockAmount());

            seedLockBalance = await gami.balanceOf(await seedLock.getAddress());
            console.log("SeedLock balance = ", formatEther(seedLockBalance) );
            expect(seedLockBalance).to.equal(await gamiTokenDistributor.seedLockAmount());

            stakingLockBalance = await gami.balanceOf(await stakingLock.getAddress());
            console.log("StakingLock balance = ", formatEther(stakingLockBalance) );
            expect(stakingLockBalance).to.equal(await gamiTokenDistributor.stakingLockAmount());

            teamLockBalance = await gami.balanceOf(await teamLock.getAddress());
            console.log("TeamLock balance = ", formatEther(teamLockBalance) );
            expect(teamLockBalance).to.equal(await gamiTokenDistributor.teamLockAmount());

            gamiSwapBalance = await gami.balanceOf(await gamiSwap.getAddress());
            console.log("GamiSwap balance = ", formatEther(gamiSwapBalance) );
            expect(gamiSwapBalance).to.equal(await gamiTokenDistributor.SWAP_CONTRACT_SUPPLY());

        });

        it ("Should all lock sum is equal total supply", async function () {
            let totalLock = advisorsLockBalance + developmentLockBalance + ecosystemGrowthLockBalance + marketingLockBalance + mergerAcquisitionLockBalance + seedLockBalance + stakingLockBalance + teamLockBalance + gamiSwapBalance;
            console.log("Total lock = ", formatEther(totalLock) );
            expect(totalLock).to.equal(await gamiTokenDistributor.MAX_SUPPLY());
        });

    });
});