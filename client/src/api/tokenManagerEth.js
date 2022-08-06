export async function getEthApr(contract) {
  return await contract.methods.APR().call();
}

export async function getEthTVL(contract) {
  return await contract.methods.getTotalStaked().call();
}

export function getEthUserInfo(contract, address) {
  return contract.methods.getUserInfo(address).call();
}

export function stakeEth(contract, address, amount) {
  return contract.methods.depositStake().send({ from: address, value: amount });
}

export function withdrawEth(contract, address, amount) {
  return contract.methods.withdrawStake(amount).send({ from: address });
}
