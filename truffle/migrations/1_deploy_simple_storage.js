const Chainlink = artifacts.require("Chainlink");

module.exports = function (deployer) {
  deployer.deploy(Chainlink);
};
