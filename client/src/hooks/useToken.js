import { useEffect, useCallback } from "react";
import useEth from "hooks/useEth";
import { ApiGetBalance } from "api/token";

const useToken = (tokenName) => {
  // userBalance should be lgobal, use context
  const { state, dispatch } = useEth();
  const { user, contracts } = state;
  const contractToken = contracts[tokenName];

  const balance = user && user.balance && user.balance[tokenName];
  const contractTokenAdress = contractToken && contractToken._address;

  const getBalance = useCallback(async () => {
    try {
      const balance = await ApiGetBalance(contractToken, user.address);
      //TODO: Make global function
      const newBalance = balance ;
      const data = {
        [tokenName]: newBalance
      };
      dispatch({ type: "SET_USER_BALANCE", data });
    } catch (error) {
      console.error(error);
    }
  }, [contractToken, dispatch, tokenName, user.address]);

  useEffect(() => {
    if (user.balance && user.balance[tokenName] > 0) {
      return;
    }
    contractToken && user.address && getBalance();
  }, [contractToken, getBalance, tokenName, user]);

  return { balance, contractTokenAdress, getBalance };
};

export default useToken;
