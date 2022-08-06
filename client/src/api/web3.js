import { Big } from "big.js";
export async function getChainId(web3) {
  return await web3.eth.getChainId();
}

export async function getNetworkId(web3) {
  return await web3.eth.net.getId();
}

export async function getBalance(web3, address) {
  if (web3 && address) {
    const result = await web3.eth.getBalance(address);
    // let balance = web3.utils.fromWei(result, 'ether')
    const balance = new Big(result);
    return balance;
  }
}
