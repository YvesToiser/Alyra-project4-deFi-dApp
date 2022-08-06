import { useCallback } from "react";
import useEth from "hooks/useEth";
import { ApiGetBalance } from "api/token";
import Big from "big.js";

const useToken = (tokenName) => {
  const { state, dispatch } = useEth();
  const { user, contracts } = state;
  const contractToken = contracts[tokenName];

  const balance = user && user.balance && user.balance[tokenName];
  // const contractTokenAdress = contractToken && contractToken._address;

  const getBalance = useCallback(async () => {
    if (!contractToken || !user.address) return;
    try {
      const balance = await ApiGetBalance(contractToken, user.address);

      const data = {
        [tokenName]: new Big(balance)
      };
      dispatch({ type: "SET_USER_BALANCE", data });
    } catch (error) {
      console.error(error);
    }
  }, [contractToken, dispatch, tokenName, user]);

  return { getBalance, balance };
};

export default useToken;
