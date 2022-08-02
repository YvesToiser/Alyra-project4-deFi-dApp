export async function ApiGetBalance(contract, address) {
  return await contract.methods.balanceOf(address).call();
}
