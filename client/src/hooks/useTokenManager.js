import { depositStake, allowance, approve, userTotalStake, withdrawStake } from "api/tokenManager";
import useEth from "hooks/useEth";
import { useEffect, useCallback, useState } from "react";
import Big from "big.js";

const useTokenManager = (tokenName) => {
  const { state, dispatch } = useEth();
  const { user, contracts } = state;

  const contractTokenManager = contracts["manager"];

  const contractToken = contracts[tokenName];
  const [allowanceValue, setAllowanceValue] = useState();
  const amountStaked = user && user.balanceStaked && user.balanceStaked[tokenName];

  const stake = async (stakeValue, curency) => {
    // Check decimal
    const value = new Big(stakeValue).mul(10 ** 18);

    try {
      await depositStake(contractTokenManager, user.address, value.toFixed());
    } catch (error) {
      console.error(error);
    }
  };

  const withdraw = async (withDrawValue, curency) => {
    // Check decimal
    const value = new Big(withDrawValue).mul(10 ** 18);

    try {
      await withdrawStake(contractTokenManager, user.address, value.toFixed());
    } catch (error) {
      console.error(error);
    }
  };

  const getApproval = async (stakeValue, curency) => {
    const value = new Big(100).mul(10).pow(19);
    try {
      await approve(contractToken, user.address, contractTokenManager._address, value.toFixed());
      setAllowanceValue(value);
      // Use event
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
  }, [contractToken, contractTokenManager, user.address]);

  // NOTE: This function allow us to save gas costs
  const getUserTotalStake = useCallback(async () => {
    try {
      const logs = await userTotalStake(contractTokenManager, user.address);
      let amount = new Big(0);
      logs.forEach((element) => {
        if (element.returnValues.operation === "deposit") {
          amount = amount.plus(new Big(element.returnValues.amount));
        }
        if (element.returnValues.operation === "withdraw") {
          amount = amount.sub(element.returnValues.amount);
        }
      });

      const data = {
        [tokenName]: amount.div(10 ** 18).toFixed()
      };
      dispatch({ type: "SET_USER_BALANCE_STAKED", data });
    } catch (error) {
      console.error(error);
    }
  }, [contractTokenManager, dispatch, tokenName, user.address]);

  // const getRewardAmount = useCallback(async () => {
  //   try {
  //     const logs = await rewardAmount(contractTokenManager, user.address);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }, [contractTokenManager, user.address]);

  useEffect(() => {
    if (!allowanceValue && user.address) {
      getAllowance();
    }

    if (contractTokenManager) {
      !amountStaked && getUserTotalStake();
    }
  }, [contractTokenManager, allowanceValue, getAllowance, getUserTotalStake, user.address, amountStaked]);

  return { getAllowance, getApproval, getUserTotalStake, stake, withdraw, allowanceValue, amountStaked };
};

export default useTokenManager;
