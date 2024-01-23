const hre = require("hardhat");

async function main() {
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address, "\n\n");

  const advisorLockMultisig = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const developmentLockMultisig = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const ecosystemGrowthLockMultisig = "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2";
  const marketingLockMultisig = "0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c";
  const mergerAcquisitionLockMultisig = "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db";
  const seedLockMultisig = "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB";
  const stakingLockMultisig = "0x617F2E2fD72FD9D5503197092aC168c91465E7f2";
  const teamLockMultisig = "0x17F6AD8Ef982297579C203069C1DbfFE4348c372";

  
  const oldGamiTokenAddress = "0x1236a887ef31b4d32e1f0a2b5e4531f52cec7e75";

  const gamiTokenDistributor = await hre.ethers.deployContract("GamiTokenDistributor");
  await gamiTokenDistributor.waitForDeployment();
  const gamiTokenDistributorAddress = await gamiTokenDistributor.getAddress();
  console.log("gamiTokenDistributor deployed to:", gamiTokenDistributorAddress);

  const gamiToken = await hre.ethers.deployContract("GamiWorldV2" , [gamiTokenDistributorAddress]);
  await gamiToken.waitForDeployment();
  const gamiTokenAddress = await gamiToken.getAddress();
  console.log("gamiToken deployed to:", gamiTokenAddress);

  const advisorLock = await hre.ethers.deployContract("AdvisorsLock", [gamiTokenAddress, advisorLockMultisig]);
  await advisorLock.waitForDeployment();
  const advisorLockAddress = await advisorLock.getAddress();
  console.log("advisorLock deployed to:", advisorLockAddress);

  const developmentLock = await hre.ethers.deployContract("DevelopmentLock", [gamiTokenAddress, developmentLockMultisig]);
  await developmentLock.waitForDeployment();
  const developmentLockAddress = await developmentLock.getAddress();
  console.log("developmentLock deployed to:", developmentLockAddress);

  const ecosystemGrowthLock = await hre.ethers.deployContract("EcosystemGrowthLock", [gamiTokenAddress, ecosystemGrowthLockMultisig]);
  await ecosystemGrowthLock.waitForDeployment();
  const ecosystemGrowthLockAddress = await ecosystemGrowthLock.getAddress();
  console.log("ecosystemGrowthLock deployed to:", ecosystemGrowthLockAddress);

  const marketingLock = await hre.ethers.deployContract("MarketingLock", [gamiTokenAddress, marketingLockMultisig]);
  await marketingLock.waitForDeployment();
  const marketingLockAddress = await marketingLock.getAddress();
  console.log("marketingLock deployed to:", marketingLockAddress);

  const mergerAcquisitionLock = await hre.ethers.deployContract("MergerAcquisitionLock", [gamiTokenAddress, mergerAcquisitionLockMultisig]);
  await mergerAcquisitionLock.waitForDeployment();
  const mergerAcquisitionLockAddress = await mergerAcquisitionLock.getAddress();
  console.log("mergerAcquisitionLock deployed to:", mergerAcquisitionLockAddress);

  const seedLock = await hre.ethers.deployContract("SeedLock", [gamiTokenAddress, seedLockMultisig]);
  await seedLock.waitForDeployment();
  const seedLockAddress = await seedLock.getAddress();
  console.log("seedLock deployed to:", seedLockAddress);

  const stakingLock = await hre.ethers.deployContract("StakingLock", [gamiTokenAddress, stakingLockMultisig]);
  await stakingLock.waitForDeployment();
  const stakingLockAddress = await stakingLock.getAddress();
  console.log("stakingLock deployed to:", stakingLockAddress);

  const teamLock = await hre.ethers.deployContract("TeamLock", [gamiTokenAddress, teamLockMultisig]);
  await teamLock.waitForDeployment();
  const teamLockAddress = await teamLock.getAddress();
  console.log("teamLock deployed to:", teamLockAddress);

  const gamiSwap = await hre.ethers.deployContract("GamiSwap", [oldGamiTokenAddress, gamiTokenAddress]);
  await gamiSwap.waitForDeployment();
  const gamiSwapAddress = await gamiSwap.getAddress();
  console.log("GamiSwap deployed to:", gamiSwapAddress);

  console.log("\n\nSending tokens to the addresses from the distribution contract...");
  const initializeTx = await gamiTokenDistributor.initializeAddressesAndSendTokens(gamiTokenAddress, [ advisorLockAddress, 
  developmentLockAddress, ecosystemGrowthLockAddress, marketingLockAddress, mergerAcquisitionLockAddress, 
  seedLockAddress, stakingLockAddress, teamLockAddress, gamiSwapAddress ]);
  
  await initializeTx.wait();

  console.log("Done!\n\n");

  console.log("Balance of advisorLock:", (await gamiToken.balanceOf(advisorLockAddress)).toString());
  console.log("Balance of developmentLock:", (await gamiToken.balanceOf(developmentLockAddress)).toString());
  console.log("Balance of ecosystemGrowthLock:", (await gamiToken.balanceOf(ecosystemGrowthLockAddress)).toString());
  console.log("Balance of marketingLock:", (await gamiToken.balanceOf(marketingLockAddress)).toString());
  console.log("Balance of mergerAcquisitionLock:", (await gamiToken.balanceOf(mergerAcquisitionLockAddress)).toString());
  console.log("Balance of seedLock:", (await gamiToken.balanceOf(seedLockAddress)).toString());
  console.log("Balance of stakingLock:", (await gamiToken.balanceOf(stakingLockAddress)).toString());
  console.log("Balance of teamLock:", (await gamiToken.balanceOf(teamLockAddress)).toString());
  console.log("Balance of gamiSwap:", (await gamiToken.balanceOf(gamiSwapAddress)).toString());
  console.log("Balance of gamiTokenDistributor:", (await gamiToken.balanceOf(gamiTokenDistributorAddress)).toString());
  console.log("Balance of deployer:", (await gamiToken.balanceOf(deployer.address)).toString());


}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
