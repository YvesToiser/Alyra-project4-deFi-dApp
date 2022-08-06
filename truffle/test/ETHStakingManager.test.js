const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");

const ETHStakingManager = artifacts.require("ETHStakingManager");
const BYX = artifacts.require("BYX");
const PriceProvider = artifacts.require("MockedPriceProvider");

contract("ETHStakingManager", function (accounts) {

    // Address parameters
    const owner = accounts[0];
    const ALICE = accounts[1];
    const BOB = accounts[2];
    const CHARLY = accounts[3];

    // Values Parameters
    const ETH_STAKING_REWARDS_SUPPLY = "20000000000000000000000000";
    const ZERO = new BN(0);
    const INSUFFICIENT_STAKE = '50000000000000000'; // 0.05
    const APPROPRIATE_STAKE = '3000000000000000000'; // 3
    const TOO_MUCH = '4000000000000000000'; // 4

    // Block Minting function
    const mintBlocks = (n) => {
        if (n > 0) {
            web3.currentProvider.send({
                jsonrpc: "2.0",
                method: "evm_mine",
                id: 1
            }, (error, response) => {
                // console.log(response);
                mintBlocks(n - 1);
            });
        }

    };

    beforeEach(async function () {
        // Deploy BYX token contract
        this.BYXInstance = await BYX.new({from: owner});
        // Deploy PriceProvider contract
        this.PPInstance = await PriceProvider.new({from: owner});
        // Deploy Staking Contract
        this.ETHstakingManagerInstance = await ETHStakingManager.new(this.BYXInstance.address, this.PPInstance.address, {from: owner});
        // Fund contract
        this.BYXInstance.mint(this.ETHstakingManagerInstance.address, ETH_STAKING_REWARDS_SUPPLY);
    });

    describe('Staking', () => {

        it("should not stake with insufficient amount", async function () {
            await expectRevert(this.ETHstakingManagerInstance.depositStake( { from: ALICE , value: INSUFFICIENT_STAKE}), "Minimum stake is 0.1 ETH.");
        });

        it("should stake correctly", async function () {
            await this.ETHstakingManagerInstance.depositStake( { from: ALICE , value: APPROPRIATE_STAKE});
            const userInfo = await this.ETHstakingManagerInstance.getUserInfo.call(ALICE, { from: ALICE});
            expect(userInfo.ethAmountStaked).to.be.bignumber.equal(APPROPRIATE_STAKE);
        });

        it("should emit appropriate event when staking", async function () {
            const res = await this.ETHstakingManagerInstance.depositStake( { from: ALICE , value: APPROPRIATE_STAKE});
            expectEvent(res, 'Stake', {user : ALICE, amount : new BN(APPROPRIATE_STAKE)})
        });
    });

    describe('UnStaking', () => {

        it("should not unstake more than available", async function () {
            await this.ETHstakingManagerInstance.depositStake( { from: ALICE , value: APPROPRIATE_STAKE});
            await expectRevert(this.ETHstakingManagerInstance.withdrawStake(TOO_MUCH, { from: ALICE }), "Not enough ETH staked.");
        });

        it("should unstake correctly", async function () {
            await this.ETHstakingManagerInstance.depositStake( { from: ALICE , value: APPROPRIATE_STAKE});
            await this.ETHstakingManagerInstance.withdrawStake(APPROPRIATE_STAKE, { from: ALICE });
            const userInfo = await this.ETHstakingManagerInstance.getUserInfo.call(ALICE, { from: ALICE});
            expect(userInfo.ethAmountStaked).to.be.bignumber.equal(ZERO);
        });

        it("should emit appropriate event when unstaking", async function () {
            await this.ETHstakingManagerInstance.depositStake( { from: ALICE , value: APPROPRIATE_STAKE});
            const res = await this.ETHstakingManagerInstance.withdrawStake(APPROPRIATE_STAKE,  { from: ALICE });
            expectEvent(res, 'WithdrawStake', {user : ALICE, amount : new BN(APPROPRIATE_STAKE)})
        });
    });

    // Due to simulation of big amounts of blocks this test suite is very time consuming.
    describe('Rewards', () => {

        it("should not claim rewards if none available", async function () {
            await this.ETHstakingManagerInstance.depositStake( { from: ALICE , value: APPROPRIATE_STAKE});
            const userInfo = await this.ETHstakingManagerInstance.getUserInfo.call(ALICE, { from: ALICE});
            expect(userInfo.pendingRewards).to.be.bignumber.equal(ZERO);
            await expectRevert(this.ETHstakingManagerInstance.claimRewards( { from: ALICE }), "You have no rewards to claim.");
        });

        it("should not have rewards before mandatory time", async function () {
            await this.ETHstakingManagerInstance.depositStake( { from: ALICE , value: APPROPRIATE_STAKE});
            mintBlocks(5000);

            function delay(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }

            await delay(4000);

            await this.ETHstakingManagerInstance.depositStake( { from: BOB , value: APPROPRIATE_STAKE});
            const userInfo = await this.ETHstakingManagerInstance.getUserInfo.call(ALICE, { from: ALICE});
            expect(userInfo.pendingRewards).to.be.bignumber.equal(ZERO);
        });

        // As these tests are very long to execute, we test 4 different things in the same test :
        // - Pool Update
        // - Rewards Availability
        // - Rewards Claim
        // - Rewards Claim Event
        it("should update rewards, have rewards after mandatory time, claim rewards correctly if available and emit appropriate event", async function () {
            await this.ETHstakingManagerInstance.depositStake( { from: ALICE , value: APPROPRIATE_STAKE } );
            await mintBlocks(7000);

            function delay(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }

            await delay(4000);

            const result = await this.ETHstakingManagerInstance.depositStake( { from: BOB , value: APPROPRIATE_STAKE});
            expectEvent(result, 'PoolUpdate');
            const AliceInfo = await this.ETHstakingManagerInstance.getUserInfo.call(ALICE, { from: ALICE});
            expect(AliceInfo.pendingRewards).to.be.bignumber.above(ZERO);
            const res = await this.ETHstakingManagerInstance.claimRewards({ from: ALICE } );
            expectEvent(res, 'RewardsClaimed', { user : ALICE });
            const userInfo = await this.ETHstakingManagerInstance.getUserInfo.call(ALICE, { from: ALICE } );
            expect(userInfo.pendingRewards).to.be.bignumber.equal(ZERO);
        });
    });
});