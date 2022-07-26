export async function depositStake(contract, address, amount) {
  return await contract.methods.depositStake(amount).send({ from: address });
}

// withdrawStake
export async function withdrawStake(contract, address, amount) {
  return await contract.methods.withdrawStake(amount).send({ from: address });
}

//check allowance
export async function allowance(contract, ownerAddress, spenderAddress) {
  // allowance(address owner, address spender)
  return await contract.methods.allowance(ownerAddress, spenderAddress).call();
}

// approve
export async function approve(contract, ownerAddress, spenderAddress, amount) {
  return await contract.methods.approve(spenderAddress, amount).send({ from: ownerAddress });
}

// getUserTotalStake
export async function userTotalStake(contract, address) {
  return await contract.getPastEvents("Stake", {
    // user
    // filter: { user: address },
    fromBlock: 0,
    toBlock: "latest"
  });
}

export async function getTvl(contract) {
  return await contract.methods.BYXPool().call();
}
export async function getApr(contract) {
  return await contract.methods.getAPR().call();
}

// getRewardAmount
export async function rewardAmount(contract, address) {
  return await contract.getPastEvents("Reward", {
    filter: { from: address },
    fromBlock: 0,
    toBlock: "latest"
  });
}
