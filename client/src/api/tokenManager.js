// stake
export async function depositStake(contract, address, amount, decimal) {
  console.log("depositStake", amount, decimal);
  console.log(amount * 10 ** decimal);
  return await contract.methods.depositStake(2000000000000).send({ from: address });
}

// withdrawStake
export async function withdrawStake(contract, address, amount) {
  return await contract.methods.withdrawStake(amount).send({ from: address });
}
// getUserTotalStake

// getTvl

// getRewardAmount
