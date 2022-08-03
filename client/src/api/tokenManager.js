import Big from "big.js";

// stake

export async function depositStake(contract, address, amount, decimal) {
  // console.log("depositStake", amount, decimal);
  // console.log(amount * 10 ** decimal);
  console.log(new Big(123.4567));
  return await contract.methods.depositStake(99999999999).send({ from: address });
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
  return await contract.methods.approve(spenderAddress, amount.toString()).send({ from: ownerAddress });
}
// getUserTotalStake
export async function userTotalStake(contract, address) {
  return await contract.getPastEvents("LogDepot");
}

// getTvl

// getRewardAmount
