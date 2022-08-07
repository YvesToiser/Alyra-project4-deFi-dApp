const BYX = artifacts.require("BYX");
const sBYX = artifacts.require("sBYX");
const BYXStakingManager = artifacts.require("BYXStakingManager");
const ETHStakingManager = artifacts.require("ETHStakingManager");
// Comment/uncomment Price Provider depending on deploy network
// For Kovan Network :
const PriceProvider = artifacts.require("PriceProvider");
// For Ganache local network :
// const PriceProvider = artifacts.require("MockedPriceProvider");

const AIRDROP_SUPPLY = "1000000000000000000000";
const STAKING_REWARDS_SUPPLY = "50000000000000000000000000";
const ETH_STAKING_REWARDS_SUPPLY = "20000000000000000000000000";
const INITIAL_STAKE = "1000000000000000000000";

module.exports = async function (deployer, _network, accounts) {
  // Deploy BYX token contract
  await deployer.deploy(BYX);
  const byxInstance = await BYX.deployed();

  // Deploy sBYX token contract
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

  // Deploy price provider
  await deployer.deploy(PriceProvider);
  const PriceProviderInstance = await PriceProvider.deployed();

  // Deploy ETH Staking Manager
  await deployer.deploy(ETHStakingManager, byxInstance.address, PriceProviderInstance.address);
  await byxInstance.mint(ETHStakingManager.address, ETH_STAKING_REWARDS_SUPPLY);
};
