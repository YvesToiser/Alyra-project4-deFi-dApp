export async function getChainId(web3) {
  return await web3.eth.getChainId();
}

export async function getNetworkId(web3) {
  return await web3.eth.net.getId();
}
function roundBalance(_balance) {
  const num = Number(_balance);
  const roundedString = num.toFixed(4);
  const rounded = Number(roundedString);
  return rounded;
}

export async function getBalance(web3, address) {
  if (web3 && address) {
    const result = await web3.eth.getBalance(address);
    let balance = web3.utils.fromWei(result, "ether");
    balance = roundBalance(balance);
    return balance;
  }
}

// stake

// withdrawStake

// getUserTotalStake

// getTvl

// getRewardAmmount
