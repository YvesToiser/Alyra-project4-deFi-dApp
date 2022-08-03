import { depositStake, allowance, approve, userTotalStake } from "api/tokenManager";
import useEth from "hooks/useEth";
import { useEffect, useCallback, useState } from "react";
import Big from "big.js";
import useToken from "hooks/useToken";

const useTokenManager = () => {
  const { state } = useEth();
  const { user, contractTokenManager, contractToken } = state;
  const [allowanceValue, setAllowanceValue] = useState();

  const stake = async (stakeValue, curency) => {
    // Check decimal
    const value = new Big(stakeValue).mul(10 ** 18);

    try {
      const result = await depositStake(contractTokenManager, user.address, value.toFixed());
    } catch (error) {
      console.error(error);
    }
  };

  const getApproval = async (stakeValue, curency) => {
    const value = new Big(100).mul(10).pow(19);
    try {
      await approve(contractToken, user.address, contractTokenManager._address, value.toFixed());
      // console.log(await allowance(contractToken, user.address, contractToken._address));
      // Use event
      setAllowanceValue(test.toNumber());
    } catch (error) {
      console.error(error);
    }
  };

  const getAllowance = useCallback(async () => {
    try {
      const result = await allowance(contractToken, user.address, contractTokenManager._address);

      setAllowanceValue(result);
    } catch (error) {
      console.error(error);
    }
  }, [contractToken, contractTokenManager._address, user.address]);

  const getUserTotalStake = async () => {
    try {
      const logs = await userTotalStake(contractTokenManager, user.address);
      console.log(logs);
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
