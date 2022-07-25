// 2_deploy_contracts.js
const Byx = artifacts.require("Byx");
const MyByxProject = artifacts.require("MyByxProject");

module.exports = async function(deployer, _network, accounts) {
    await deployer.deploy(Byx);
    const byx = await Byx.deployed();
	await deployer.deploy(MyByxProject, byx.address);
	const myByxProject = await MyByxProject.deployed();
	await byx.faucet(myByxProject.address, 100);
	await myByxProject.byxTransfer(accounts[1], 100);
 
	const balance0 = await byx.balanceOf(myByxProject.address);
	const balance1 = await byx.balanceOf(accounts[1]);
 
	console.log(balance0.toString());
	console.log(balance1.toString());
};