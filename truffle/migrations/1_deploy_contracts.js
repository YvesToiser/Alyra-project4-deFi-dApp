// 2_deploy_contracts.js
const Byx = artifacts.require("Byx");
const ByxManager = artifacts.require("ByxManager");
const EthUsdPrice = artifacts.require("EthUsdPrice");

module.exports = async function(deployer, _network, accounts) {
    await deployer.deploy(EthUsdPrice)
	const ethUsdPrice = await EthUsdPrice.deployed();
	
	await deployer.deploy(Byx);
    const byx = await Byx.deployed();

	await deployer.deploy(ByxManager, byx.address);
	const byxManager = await ByxManager.deployed();

	await byx.faucet(ByxManager.address, 100);
	await byxManager.byxTransfer(accounts[1], 100);
 
	const balance0 = await byx.balanceOf(ByxManager.address);
	const balance1 = await byx.balanceOf(accounts[1]);
 
	console.log(balance0.toString());
	console.log(balance1.toString());
};