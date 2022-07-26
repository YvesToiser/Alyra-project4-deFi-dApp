const Byx = artifacts.require("Byx");
const ETHUSDPriceProvider = artifacts.require("ETHUSDPriceProvider");
const BYXStakingManager = artifacts.require("BYXStakingManager");

const AIRDROP_SUPPLY = 1000;
const STAKING_REWARDS_SUPPLY = 50*1000*1000;
const TOTAL_SUPPLY = 100*1000*1000;

module.exports = async function(deployer, _network, accounts) {

	// Deploy BYX token contract
	await deployer.deploy(Byx);
    const byxInstance = await Byx.deployed();

	// Deploy Staking Contract
	await deployer.deploy(BYXStakingManager, byxInstance.address);
	const BYXstakingManagerInstance = await BYXStakingManager.deployed();

	// Mint tokens and send them to BYXManager
	await byxInstance.faucet(BYXstakingManagerInstance.address, STAKING_REWARDS_SUPPLY);
	await byxInstance.faucet(accounts[1], AIRDROP_SUPPLY);
	await byxInstance.faucet(accounts[2], AIRDROP_SUPPLY);
	await byxInstance.faucet(accounts[3], AIRDROP_SUPPLY);
	await byxInstance.faucet(accounts[4], AIRDROP_SUPPLY);
	await byxInstance.faucet(accounts[5], AIRDROP_SUPPLY);
	await byxInstance.faucet(accounts[6], AIRDROP_SUPPLY);

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