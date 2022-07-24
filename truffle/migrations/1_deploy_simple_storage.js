const Chainlink = artifacts.require("Chainlink");
//let id=8888;
module.exports = function (deployer) {
  deployer.deploy(Chainlink);
};
