import { depositStake, allowance, approve, userTotalStake } from "api/tokenManager";
import useEth from "hooks/useEth";
import { useEffect, useCallback, useState } from "react";
import Big from "big.js";

const useTokenManager = () => {
  const { state } = useEth();
  const { user, contractTokenManager, contractToken } = state;
  const [allowanceValue, setAllowanceValue] = useState();

  const stake = async (stakeValue, curency) => {
    try {
      const test = new Big(10 * 10 ** 18);
      const result = await depositStake(contractTokenManager, user.address, test, 18);
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  const getApproval = async (stakeValue, curency) => {
    const test = new Big(100000000 * 100000000);
    try {
      await approve(contractToken, user.address, contractTokenManager._address, test);
      console.log(await allowance(contractToken, user.address, contractToken._address));
      setAllowanceValue(await allowance(contractToken, user.address, contractToken._address));
    } catch (error) {
      console.error(error);
    }
  };

  const getAllowance = useCallback(async () => {
    try {
      const result = await allowance(contractToken, user.address, contractTokenManager._address);
      console.log(result);
      setAllowanceValue(result);
    } catch (error) {
      console.error(error);
    }
  }, [contractToken, contractTokenManager._address, user.address]);

  const getUserTotalStake = async () => {
    try {
      const logs = await userTotalStake(contractTokenManager, user.address);
      console.log(logs);
      console.log(contractTokenManager);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    !allowanceValue && getAllowance();
  }, [allowanceValue, getAllowance]);

  return { getAllowance, getApproval, getUserTotalStake, stake, allowanceValue };
};

export default useTokenManager;
