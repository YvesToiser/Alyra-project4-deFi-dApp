import { useCallback } from "react";

const useWallet = () => {
  const askAccount = useCallback(async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      });
      return accounts[0] || null;
    }
  }, []);

  const getAccount = useCallback(async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: "eth_accounts" });

      return accounts[0] || null;
    }
  }, []);

  return { askAccount, getAccount };
};

export default useWallet;
