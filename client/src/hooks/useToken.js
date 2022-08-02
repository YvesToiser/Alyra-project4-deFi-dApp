import { useState, useEffect, useCallback } from "react";
import useEth from "hooks/useEth";
import { ApiGetBalance } from "api/token";

const useToken = () => {
  const [balance, setBalance] = useState(0);
  const { state } = useEth();
  const { user, contractToken } = state;
  const contractTokenAdress = contractToken && contractToken._address;

  const getBalance = useCallback(async () => {
    try {
      const balance = await ApiGetBalance(contractToken, user.address);
      setBalance(balance / 10 ** 18);
    } catch (error) {
      console.log(error);
    }
  }, [contractToken, user.address]);

  useEffect(() => {
    contractToken && getBalance();
  }, [contractToken, getBalance]);

  return { balance, contractTokenAdress };
};

export default useToken;
