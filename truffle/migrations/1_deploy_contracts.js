const BYX = artifacts.require("BYX");
const sBYX = artifacts.require("sBYX");
const ETHUSDPriceProvider = artifacts.require("ETHUSDPriceProvider");
const BYXStakingManager = artifacts.require("BYXStakingManager");

const TOTAL_SUPPLY = 100*1000*1000;
const AIRDROP_SUPPLY = 1000;
const STAKING_REWARDS_SUPPLY = TOTAL_SUPPLY * 0.5;
const INITIAL_STAKE = 1000;

module.exports = async function(deployer, _network, accounts) {

	// Deploy BYX token contract
	await deployer.deploy(BYX);
    const byxInstance = await BYX.deployed();

	// Deploy BYX token contract
	await deployer.deploy(sBYX);
	const sByxInstance = await sBYX.deployed();

	// Deploy Staking Contract
	await deployer.deploy(BYXStakingManager, byxInstance.address, sByxInstance.address);
	const BYXstakingManagerInstance = await BYXStakingManager.deployed();

	// Mint tokens and send them to BYXManager
	await byxInstance.mint(BYXstakingManagerInstance.address, STAKING_REWARDS_SUPPLY);
	await byxInstance.mint(accounts[1], AIRDROP_SUPPLY);
	await byxInstance.mint(accounts[2], AIRDROP_SUPPLY);
	await byxInstance.mint(accounts[3], AIRDROP_SUPPLY);
	await byxInstance.mint(accounts[4], AIRDROP_SUPPLY);
	await byxInstance.mint(accounts[5], AIRDROP_SUPPLY);
	await byxInstance.mint(accounts[6], AIRDROP_SUPPLY);

	// Authorize staker address And initial stake
	await sByxInstance.authorize(BYXstakingManagerInstance.address);
	await BYXstakingManagerInstance.initializePool(INITIAL_STAKE);

	//Check balances
	const balance1 = await byxInstance.balanceOf(accounts[1]);
	const balance2 = await byxInstance.balanceOf(BYXstakingManagerInstance.address);
	console.log(balance1.toString());
	console.log(balance2.toString());

	// Deploy ETH/USD price provider
	await deployer.deploy(ETHUSDPriceProvider);
	const ethUsdPrice = await ETHUSDPriceProvider.deployed();
	console.log(ethUsdPrice.toString());
};