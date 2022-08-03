import { useState, useEffect, useCallback } from "react";
import useEth from "hooks/useEth";
import { ApiGetBalance } from "api/token";

const useToken = () => {
  // userBalance should be lgobal, use context
  const [balance, setBalance] = useState(0);
  const { state } = useEth();
  const { user, contractToken } = state;
  const contractTokenAdress = contractToken && contractToken._address;

  const getBalance = useCallback(async () => {
    try {
      const balance = await ApiGetBalance(contractToken, user.address);

      const newBalance = balance / 10 ** 18;
      setBalance(newBalance);
      // setBalance(balance);
    } catch (error) {
      console.log(error);
    }
  }, [contractToken, user.address]);

  useEffect(() => {
    contractToken && getBalance();
  }, [contractToken, getBalance]);

  useEffect(() => {
    console.log(balance);
  }, [balance]);

  return { balance, contractTokenAdress, getBalance };
};

export default useToken;
