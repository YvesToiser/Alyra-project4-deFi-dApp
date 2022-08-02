const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const SBYX = artifacts.require('sBYX');

contract('BYX', function (accounts) {

    // sBYX values
    const SBYX_NAME = 'Staked Byx';
    const SBYX_SYMBOL = 'sBYX';

    // Supply parameters
    const INITIAL_VALUE = new BN(0);
    const MINT_AMOUNT = "1000000000000000000000";
    const BURN_AMOUNT = "1000000000000000000000";

    // Address parameters
    const owner = accounts[0];
    const ALICE = accounts[1];
    const BOB = accounts[2];
    const CHARLY = accounts[3];
    const AUTHORIZED_ADDRESS = accounts[4];

    beforeEach(async function () {
        // Deploy BYX token contract
        this.sByxInstance = await SBYX.new({from: owner});
    });

    describe('GETTERS', () => {

        it('should return token name correctly', async function () {
            const result  = await this.sByxInstance.name.call();
            expect(result).to.equal(SBYX_NAME);
        });

        it('should return token symbol correctly', async function () {
            const result  = await this.sByxInstance.symbol.call();
            expect(result).to.equal(SBYX_SYMBOL);
        });
    });

    describe('Mint and authorization', () => {

        it('should not mint if not authorized', async function () {
            await expectRevert(this.sByxInstance.mint(ALICE, MINT_AMOUNT, {from: owner}),
                "caller is not authorized");
        });


        it('should not authorize by wrong address', async function () {
            await expectRevert(this.sByxInstance.authorize(AUTHORIZED_ADDRESS, {from: ALICE}),
                "Ownable: caller is not the owner");

        });

        it('should mint if authorized', async function () {
            await this.sByxInstance.authorize(AUTHORIZED_ADDRESS, {from: owner});
            this.sByxInstance.mint(ALICE, MINT_AMOUNT, {from: AUTHORIZED_ADDRESS});
        });
    });

    describe('Burn & Burn From', () => {

        beforeEach(async function () {
            await this.sByxInstance.authorize(AUTHORIZED_ADDRESS, {from: owner});
        });

        it('should not burn if not owner', async function () {
            await this.sByxInstance.mint(BOB, MINT_AMOUNT, {from: AUTHORIZED_ADDRESS});
            await expectRevert(this.sByxInstance.burn(BURN_AMOUNT, {from: BOB}),
                "Ownable: caller is not the owner.");
        });

        it('should be able to burn if owner', async function () {
            await this.sByxInstance.mint(owner, MINT_AMOUNT, {from: AUTHORIZED_ADDRESS});
            await this.sByxInstance.burn(BURN_AMOUNT, {from: owner});
            const ownerBalance  = await this.sByxInstance.balanceOf.call(owner);
            expect(ownerBalance).to.be.bignumber.equal(new BN(MINT_AMOUNT - BURN_AMOUNT));
        });

        it('should not burn if balance is insufficient', async function () {
            await expectRevert(this.sByxInstance.burn(BURN_AMOUNT, {from: owner}),
                "ERC20: burn amount exceeds balance");
        });

        it('should not burn from if not authorized', async function () {
            await this.sByxInstance.mint(ALICE, MINT_AMOUNT, {from: AUTHORIZED_ADDRESS});
            await expectRevert(this.sByxInstance.burnFrom(ALICE, BURN_AMOUNT, {from: BOB}),
                "caller is not authorized");
        });

        it('should be able to burn from if authorized', async function () {
            await this.sByxInstance.mint(ALICE, MINT_AMOUNT, {from: AUTHORIZED_ADDRESS});
            await this.sByxInstance.burnFrom(ALICE, BURN_AMOUNT, {from: AUTHORIZED_ADDRESS});
            const aliceBalance  = await this.sByxInstance.balanceOf.call(ALICE);
            expect(aliceBalance).to.be.bignumber.equal(new BN(MINT_AMOUNT - BURN_AMOUNT));
        });
    });

});