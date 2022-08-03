const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");
const BYXStakingManager = artifacts.require("BYXStakingManager");
const sBYX = artifacts.require("sBYX");
const BYX = artifacts.require("BYX");

contract("BYXStakingManager", function (accounts) {

    // Supply parameters
    const AIRDROP_SUPPLY = "1000000000000000000000";
    const STAKING_REWARDS_SUPPLY = "50000000000000000000000000";
    const INITIAL_STAKE = "1000000000000000000000";
    const INITIAL_VALUE = new BN(0);
    const ANY_STAKE = '1000000000000000000';

    // Address parameters
    const owner = accounts[0];
    const ALICE = accounts[1];
    const BOB = accounts[2];
    const CHARLY = accounts[3];

    beforeEach(async function () {
        // Deploy BYX token contract
        this.byxInstance = await BYX.new({from: owner});
        // Deploy sBYX token contract
        this.sByxInstance = await sBYX.new({from: owner});
        // Deploy Staking Contract
        this.BYXstakingManagerInstance = await BYXStakingManager.new(this.byxInstance.address, this.sByxInstance.address, {from: owner});

        // Mint tokens and send them to BYXManager
        await this.byxInstance.mint(this.BYXstakingManagerInstance.address, STAKING_REWARDS_SUPPLY);
        await this.byxInstance.mint(ALICE, AIRDROP_SUPPLY);
        await this.byxInstance.mint(BOB, AIRDROP_SUPPLY);
        await this.byxInstance.mint(CHARLY, AIRDROP_SUPPLY);

        // Authorize staker address And initial stake
        await this.sByxInstance.authorize(this.BYXstakingManagerInstance.address);
        await this.BYXstakingManagerInstance.initializePool(INITIAL_STAKE);
    });

    describe('Total Supply & Mint', () => {

        it("should stake correctly", async function () {
            await this.byxInstance.approve(this.BYXstakingManagerInstance.address, ANY_STAKE, { from: ALICE });
            const allowance = await this.byxInstance.allowance(ALICE, this.BYXstakingManagerInstance.address);
            console.log('allowance : ' + allowance);
            await this.BYXstakingManagerInstance.depositStake(ANY_STAKE, { from: ALICE });
            const sBYXBalance = await this.sByxInstance.balanceOf.call(ALICE, { from: ALICE });
            expect(sBYXBalance).to.be.bignumber.above(INITIAL_VALUE);
        });

        it("should unstake correctly", async function () {
            await this.byxInstance.approve(this.BYXstakingManagerInstance.address, ANY_STAKE, { from: ALICE });
            await this.BYXstakingManagerInstance.depositStake(ANY_STAKE, { from: ALICE });
            const sBYXBalance = await this.sByxInstance.balanceOf.call(ALICE, { from: ALICE });
            await this.sByxInstance.approve(this.BYXstakingManagerInstance.address, sBYXBalance, { from: ALICE });
            await this.BYXstakingManagerInstance.withdrawStake(sBYXBalance, { from: ALICE });
            const newsBYXBalance = await this.sByxInstance.balanceOf.call(ALICE, { from: ALICE });
            const newBYXBalance = await this.byxInstance.balanceOf.call(ALICE, { from: ALICE });
            expect(newBYXBalance).to.be.bignumber.above(AIRDROP_SUPPLY);  // Alice must have earned some rewards
            expect(newsBYXBalance).to.be.bignumber.equal(INITIAL_VALUE);  // Alice must have no more sBYX tokens left
        });

        it("should reward correctly", async function () {
            // Bob stakes first
            await this.byxInstance.approve(this.BYXstakingManagerInstance.address, ANY_STAKE, { from: BOB });
            await this.BYXstakingManagerInstance.depositStake(ANY_STAKE, { from: BOB });
            // Then Alice stakes
            await this.byxInstance.approve(this.BYXstakingManagerInstance.address, ANY_STAKE, { from: ALICE });
            await this.BYXstakingManagerInstance.depositStake(ANY_STAKE, { from: ALICE });
            const sBYXBalance = await this.sByxInstance.balanceOf.call(ALICE, { from: ALICE });
            const BYXBalance = await this.byxInstance.balanceOf.call(ALICE, { from: ALICE });
            console.log('sBYXBalance : ' + sBYXBalance);
            console.log('BYXBalance : ' + BYXBalance);
            // Alice unstake first
            await this.sByxInstance.approve(this.BYXstakingManagerInstance.address, sBYXBalance, { from: ALICE });
            const allowanceS = await this.sByxInstance.allowance(ALICE, this.BYXstakingManagerInstance.address);
            console.log('allowanceS : ' + allowanceS);
            await this.BYXstakingManagerInstance.withdrawStake(sBYXBalance, { from: ALICE });
            const newsBYXBalance = await this.sByxInstance.balanceOf.call(ALICE, { from: ALICE });
            const newBYXBalance = await this.byxInstance.balanceOf.call(ALICE, { from: ALICE });
            console.log('newsBYXBalance : ' + newsBYXBalance);
            console.log('newBYXBalance : ' + newBYXBalance);
            // Then Bob unstake
            await this.sByxInstance.approve(this.BYXstakingManagerInstance.address, sBYXBalance, { from: BOB });
            await this.BYXstakingManagerInstance.withdrawStake(sBYXBalance, { from: BOB });
            const BobBYXBalance = await this.byxInstance.balanceOf.call(BOB, { from: BOB });
            console.log('BobBYXBalance : ' + BobBYXBalance);
            expect(newBYXBalance).to.be.bignumber.above(AIRDROP_SUPPLY);  // Alice must have earned some rewards
            expect(BobBYXBalance).to.be.bignumber.above(newBYXBalance); // Bob must have earned more rewards than Alice
        });
    });
});