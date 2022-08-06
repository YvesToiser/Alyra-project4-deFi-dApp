import { Big } from "big.js";

export async function getEthApr(contract) {
  return await contract.methods.APR().call();
}

export async function getEthTVL(contract) {
  const stakeLogs = await contract.getPastEvents("Stake", {
    // user
    // filter: { user: address },
    fromBlock: 0,
    toBlock: "latest"
  });

  const withdrawLogs = await contract.getPastEvents("WithdrawStake", {
    // user
    // filter: { user: address },
    fromBlock: 0,
    toBlock: "latest"
  });

  const totalStake = stakeLogs.reduce((acc, curr) => {
    return acc.plus(curr.returnValues.amount);
  }, new Big(0));

  const totalWithdraw = withdrawLogs.reduce((acc, curr) => {
    return acc.plus(curr.returnValues.amount);
  }, new Big(0));

  const tvl = totalStake.minus(totalWithdraw);

  return tvl;
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
