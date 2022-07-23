const Chainlink2 = artifacts.require("Chainlink2");
let id=8888;
module.exports = function (deployer) {
  deployer.deploy(Chainlink2, id);
};
