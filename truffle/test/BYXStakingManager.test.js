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
    const BIG_INITIAL_STAKE = "500000000000000000000000";
    const HUGE_INITIAL_STAKE = "20000000000000000000000000";
    const ZERO_VALUE = new BN(0);
    const ANY_STAKE = '1000000000000000000';
    const LOWER_AMOUNT = '500000000000000000';

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

    });

    describe('Staking', () => {

        beforeEach(async function () {
            // initial stake
            await this.BYXstakingManagerInstance.initializePool(INITIAL_STAKE);
        });

        it("should not stake with insufficient allowance", async function () {
            await this.byxInstance.approve(this.BYXstakingManagerInstance.address, LOWER_AMOUNT, { from: ALICE });
            await expectRevert(this.BYXstakingManagerInstance.depositStake(ANY_STAKE, { from: ALICE }), "BYX: insufficient allowance");
        });

        it("should not stake with insufficient fund", async function () {
            await expectRevert(this.BYXstakingManagerInstance.depositStake(ANY_STAKE + AIRDROP_SUPPLY, { from: ALICE }), "Not enough BYX in wallet");
        });

        it("should not stake with null amount", async function () {
            await this.byxInstance.approve(this.BYXstakingManagerInstance.address, ANY_STAKE, { from: ALICE });
            await expectRevert(this.BYXstakingManagerInstance.depositStake(ZERO_VALUE, { from: ALICE }), "Amount must be positive");
        });

        it("should stake correctly", async function () {
            await this.byxInstance.approve(this.BYXstakingManagerInstance.address, ANY_STAKE, { from: ALICE });
            const res = await this.BYXstakingManagerInstance.depositStake(ANY_STAKE, { from: ALICE });
            const sBYXBalance = await this.sByxInstance.balanceOf.call(ALICE, { from: ALICE });
            expect(sBYXBalance).to.be.bignumber.above(ZERO_VALUE);
            expectEvent(res, 'StakeDeposit', {user : ALICE, amount : new BN(ANY_STAKE)});
        });
    });

    describe('UnStaking', () => {

        beforeEach(async function () {
            // initial stake
            await this.BYXstakingManagerInstance.initializePool(INITIAL_STAKE);
            // Alice is staking
            await this.byxInstance.approve(this.BYXstakingManagerInstance.address, ANY_STAKE, { from: ALICE });
            await this.BYXstakingManagerInstance.depositStake(ANY_STAKE, { from: ALICE });
        });

        it("should not unstake with insufficient allowance", async function () {
            const sBYXBalance = await this.sByxInstance.balanceOf.call(ALICE, { from: ALICE });
            await this.sByxInstance.approve(this.BYXstakingManagerInstance.address, LOWER_AMOUNT, { from: ALICE });
            await expectRevert(this.BYXstakingManagerInstance.withdrawStake(sBYXBalance, { from: ALICE }), "BYX: insufficient allowance");
        });

        it("should not unstake with insufficient fund", async function () {
            const sBYXBalance = await this.sByxInstance.balanceOf.call(ALICE, { from: ALICE });
            await expectRevert(this.BYXstakingManagerInstance.withdrawStake(ANY_STAKE + sBYXBalance, { from: ALICE }), "Not enough sBYX in wallet");
        });

        it("should not unstake with null amount", async function () {
            await expectRevert(this.BYXstakingManagerInstance.withdrawStake(ZERO_VALUE, { from: ALICE }), "Amount must be positive");
        });

        it("should unstake correctly", async function () {
            const sBYXBalance = await this.sByxInstance.balanceOf.call(ALICE, { from: ALICE });
            await this.sByxInstance.approve(this.BYXstakingManagerInstance.address, sBYXBalance, { from: ALICE });
            const res = await this.BYXstakingManagerInstance.withdrawStake(sBYXBalance, { from: ALICE });
            const newsBYXBalance = await this.sByxInstance.balanceOf.call(ALICE, { from: ALICE });
            const newBYXBalance = await this.byxInstance.balanceOf.call(ALICE, { from: ALICE });
            expect(newBYXBalance).to.be.bignumber.above(AIRDROP_SUPPLY);  // Alice must have earned some rewards
            expect(newsBYXBalance).to.be.bignumber.equal(ZERO_VALUE);  // Alice must have no more sBYX tokens left
            expectEvent(res, 'StakeWithdraw', {user : ALICE, bps : new BN(10000)}); // 100% of her sBYX -> 10 000 bps
        });

    });

    describe('Rewards', () => {

        beforeEach(async function () {
            // initial stake
            await this.BYXstakingManagerInstance.initializePool(INITIAL_STAKE);
        });

        it("should reward correctly", async function () {
            // Bob stakes first
            await this.byxInstance.approve(this.BYXstakingManagerInstance.address, ANY_STAKE, { from: BOB });
            await this.BYXstakingManagerInstance.depositStake(ANY_STAKE, { from: BOB });
            // Then Alice stakes
            await this.byxInstance.approve(this.BYXstakingManagerInstance.address, ANY_STAKE, { from: ALICE });
            await this.BYXstakingManagerInstance.depositStake(ANY_STAKE, { from: ALICE });
            const sBYXBalance = await this.sByxInstance.balanceOf.call(ALICE, { from: ALICE });
            // Alice unstake first
            await this.sByxInstance.approve(this.BYXstakingManagerInstance.address, sBYXBalance, { from: ALICE });
            await this.BYXstakingManagerInstance.withdrawStake(sBYXBalance, { from: ALICE });
            const newBYXBalance = await this.byxInstance.balanceOf.call(ALICE, { from: ALICE });
            // Then Bob unstake
            await this.sByxInstance.approve(this.BYXstakingManagerInstance.address, sBYXBalance, { from: BOB });
            await this.BYXstakingManagerInstance.withdrawStake(sBYXBalance, { from: BOB });
            const BobBYXBalance = await this.byxInstance.balanceOf.call(BOB, { from: BOB });
            expect(newBYXBalance).to.be.bignumber.above(AIRDROP_SUPPLY);  // Alice must have earned some rewards
            expect(BobBYXBalance).to.be.bignumber.above(newBYXBalance); // Bob must have earned more rewards than Alice
        });

        it("should increase reward with new block", async function () {
            // Bob stakes first
            await this.byxInstance.approve(this.BYXstakingManagerInstance.address, ANY_STAKE, { from: BOB });
            await this.BYXstakingManagerInstance.depositStake(ANY_STAKE, { from: BOB });
            let BobsBYXBalance = await this.sByxInstance.balanceOf.call(BOB, { from: BOB });

            // Then Bob unstake
            await this.sByxInstance.approve(this.BYXstakingManagerInstance.address, BobsBYXBalance, { from: BOB });
            await this.BYXstakingManagerInstance.withdrawStake(BobsBYXBalance, { from: BOB });
            BobBYXBalance = await this.byxInstance.balanceOf.call(BOB, { from: BOB });

            // Alice stakes
            await this.byxInstance.approve(this.BYXstakingManagerInstance.address, ANY_STAKE, { from: ALICE });
            await this.BYXstakingManagerInstance.depositStake(ANY_STAKE, { from: ALICE });
            let AlicesBYXBalance = await this.sByxInstance.balanceOf.call(ALICE, { from: ALICE });

            web3.currentProvider.send({
                jsonrpc: "2.0",
                method: "evm_mine",
                id: 1
            }, (error, response) => {
                console.log(response);
            });

            // Then Alice unstake after one more block
            await this.sByxInstance.approve(this.BYXstakingManagerInstance.address, AlicesBYXBalance, { from: ALICE });
            await this.BYXstakingManagerInstance.withdrawStake(AlicesBYXBalance, { from: ALICE });
            AliceBYXBalance = await this.byxInstance.balanceOf.call(ALICE, { from: ALICE });

            // Therefore she must have earned more rewards than Bob
            // Alice : 1000013182781415061517
            // Bob   : 1000008637236084452974
            expect(AliceBYXBalance).to.be.bignumber.above(BobBYXBalance);

        });

    });

    describe('Pool info', () => {

        it("should return pool value correctly after initialization", async function () {
            // initial stake
            await this.BYXstakingManagerInstance.initializePool(INITIAL_STAKE);

            const PoolValue = await this.BYXstakingManagerInstance.BYXPool.call({ from: ALICE });
            expect(PoolValue).to.be.bignumber.equal(INITIAL_STAKE);
        });

        it("should return pool value correctly after staking", async function () {
            // initial stake
            await this.BYXstakingManagerInstance.initializePool(INITIAL_STAKE);

            // Alice stakes
            await this.byxInstance.approve(this.BYXstakingManagerInstance.address, ANY_STAKE, { from: ALICE });
            await this.BYXstakingManagerInstance.depositStake(ANY_STAKE, { from: ALICE });

            const PoolValue = await this.BYXstakingManagerInstance.BYXPool.call({ from: ALICE });
            const expectedPoolValue = '1001000000000000000000'; //INITIAL_STAKE + ANY_STAKE;
            // Should be :  expectedPoolValue + BlockRewards * nb of blocks
            expect(PoolValue).to.be.bignumber.above(expectedPoolValue);
        });

        it("should return APR correctly with initial stake", async function () {
            // initial stake
            await this.BYXstakingManagerInstance.initializePool(INITIAL_STAKE);

            const APR = await this.BYXstakingManagerInstance.getAPR.call({ from: ALICE });
            // BYXRewardPerBlock * 6400 * 365 * 10000 / BYXPool
            // 5000000000000000000 * 6400 * 365 * 10000 / 1000000000000000000000
            // 116800000 -> 1 168 000 %
            const expectedAPR = '116800000';
            expect(APR).to.be.bignumber.equal(expectedAPR);
        });

        it("should return APR correctly with bigger initial stake", async function () {
            // initial stake
            await this.BYXstakingManagerInstance.initializePool(BIG_INITIAL_STAKE);

            const APR = await this.BYXstakingManagerInstance.getAPR.call({ from: ALICE });
            // BYXRewardPerBlock * 6400 * 365 * 10000 / BYXPool
            // 5000000000000000000 * 6400 * 365 * 10000 / 500000000000000000000000
            // 233600 -> 2336%
            const expectedAPR = '233600';
            expect(APR).to.be.bignumber.equal(expectedAPR);
        });

        it("should return APR correctly with even bigger initial stake", async function () {
            // initial stake
            await this.BYXstakingManagerInstance.initializePool(HUGE_INITIAL_STAKE);

            const APR = await this.BYXstakingManagerInstance.getAPR.call({ from: ALICE });
            // BYXRewardPerBlock * 6400 * 365 * 10000 / BYXPool
            // 5000000000000000000 * 6400 * 365 * 10000 / 20000000000000000000000000
            // 5840 -> 58.4%
            const expectedAPR = '5840';
            expect(APR).to.be.bignumber.equal(expectedAPR);
        });
    });

});