// stake
export async function depositStake(contract, address, amount, decimal) {
  // console.log("depositStake", amount, decimal);
  // console.log(amount * 10 ** decimal);

  return await contract.methods.depositStake(200).send({ from: address });
}

// withdrawStake
export async function withdrawStake(contract, address, amount) {
  return await contract.methods.withdrawStake(amount).send({ from: address });
}

//check allowance
export async function allowance(contract, address) {
  return await contract.methods.allowance(address, address).call();
}

// approve
export async function approve(contract, allowedAddress, spenderAddress, amount) {
  return await contract.methods.approve(allowedAddress, amount).send({ from: spenderAddress });
}
// getUserTotalStake
export async function userTotalStake(contract, address) {
  return await contract.getPastEvents("LogDepot", {
    filter: {
      owner: address
    },
    fromBlock: 0,
    toBlock: "latest"
  });
}

// getTvl

// getRewardAmount
