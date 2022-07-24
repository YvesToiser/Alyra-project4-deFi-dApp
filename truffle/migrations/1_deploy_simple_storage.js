const Chainlink3 = artifacts.require("Chainlink3");
//let id=8888;
module.exports = function (deployer) {
  deployer.deploy(Chainlink3);
};
