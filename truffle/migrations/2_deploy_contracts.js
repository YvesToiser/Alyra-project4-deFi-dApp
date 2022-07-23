// 2_deploy_contracts.js
const Byx = artifacts.require("Byx");

module.exports = async function(deployer, _network, accounts) {
await deployer.deploy(Byx);
};