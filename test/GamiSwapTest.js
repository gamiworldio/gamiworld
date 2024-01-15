const { expect } = require("chai");
const { ethers } = require("hardhat");
const { parseEther, formatEther, parseUnits, formatUnits } = require("ethers/utils");

describe("GamiSwap", function () {

    let oldGamiTokenAddress;
    let newGamiTokenAddress;
    let oldGami;
    let newGami;
    let gamiSwap;
    let owner;
    let tokenHolder;
    let swapAmount = 100;
    before(async function () {
        [owner, tokenHolder] = await ethers.getSigners();
        [ownerAddress, tokenHolderAddress] = await Promise.all([
        owner.getAddress(),
        tokenHolder.getAddress(),
        ]);
        
        const OldGami = await ethers.getContractFactory("MTK6");
        oldGami = await OldGami.deploy();

        const NewGami = await ethers.getContractFactory("MTK18");
        newGami = await NewGami.deploy();
        
        oldGamiTokenAddress = await oldGami.getAddress();
        newGamiTokenAddress = await newGami.getAddress();

        const GamiSwap = await ethers.getContractFactory("GamiSwap");
        gamiSwap = await GamiSwap.deploy(oldGamiTokenAddress, newGamiTokenAddress);

        console.log("GamiSwap deployed to:", await gamiSwap.getAddress());
        console.log("OldGami deployed to:", await oldGami.getAddress());
        console.log("NewGami deployed to:", await newGami.getAddress());
        console.log("Owner address:", ownerAddress);
        console.log("Owner MTK6 balance:", (await oldGami.balanceOf(ownerAddress)).toString());
        console.log("Owner MTK8 balance:",( await newGami.balanceOf(ownerAddress)).toString());

    });
    
    describe("Deployment", function () {
        
        it("Should set the right oldGamiTokenAddress", async function () {
            expect(await gamiSwap.oldGamiTokenAddress()).to.equal(oldGamiTokenAddress);
        });  

        it("Should set the right newGamiTokenAddress", async function () {
            expect(await gamiSwap.newGamiTokenAddress()).to.equal(newGamiTokenAddress);
        });

        it("Should transfer new Gami tokens to the contract", async function () {
            let transferAmount = parseEther(String(swapAmount));
            await newGami.transfer(await gamiSwap.getAddress(), transferAmount);
            expect(await newGami.balanceOf(await gamiSwap.getAddress())).to.equal(transferAmount);
        });

        it("Should transfers do correctly", async function () {
            let transferAmountNewGami = await newGami.balanceOf(ownerAddress);
            await newGami.transfer(tokenHolderAddress, transferAmountNewGami);

            let transferAmountOldGami = await oldGami.balanceOf(ownerAddress);
            await oldGami.transfer(tokenHolderAddress, transferAmountOldGami);

            await oldGami.connect(tokenHolder).transfer(ownerAddress, parseUnits(String(swapAmount+30), 6));

            expect(await oldGami.balanceOf(ownerAddress)).to.equal(parseUnits(String(swapAmount+30), 6));
            expect(await newGami.balanceOf(ownerAddress)).to.equal(0);
        });

        it ("Should revert if zero amount is swapped", async function () {
            await expect(gamiSwap.swap(0)).to.be.revertedWith("Zero amount swap not allowed.");
        });

        it ("Should allowance given succesfully", async function () {
            let approveAmount = parseEther(String(swapAmount*2));
            await oldGami.approve(await gamiSwap.getAddress(), approveAmount);
            expect(await oldGami.allowance(ownerAddress, await gamiSwap.getAddress())).to.equal(approveAmount);
        });

        it ("Should revert if contract has lower balance", async function () {
            await expect(gamiSwap.swap(parseUnits(String(swapAmount+15), 6))).to.be.revertedWith("Not enough balance in contract");
        });

        it ("Should revert if user has lower balance", async function () {
            await expect(gamiSwap.swap(parseUnits(String(swapAmount+60), 6))).to.be.revertedWith("Unsufficent balance");
        });

        it ("Should swap succesfully", async function () {
            let rawSwapAmount = swapAmount/2;
            let swapAmount6Decimals = parseUnits(String(rawSwapAmount), 6);
            let swapAmount18Decimals = parseUnits(String(rawSwapAmount), 18);
            await gamiSwap.swap(swapAmount6Decimals);
            expect(await newGami.balanceOf(ownerAddress)).to.equal(swapAmount18Decimals);
        });

        it ("Should totalSwapped amount is equal contract's old gami balance", async function () {
            let totalSwapped = await gamiSwap.totalSwapped();
            totalSwapped = formatUnits(totalSwapped, 18);

            let contractOldGamiBalance = await oldGami.balanceOf(await gamiSwap.getAddress());
            contractOldGamiBalance = formatUnits(contractOldGamiBalance, 6);

            expect(totalSwapped).to.equal(contractOldGamiBalance);
        });
    });
});
