import useEth from "hooks/useEth";
import { depositStake, allowance, approve, userTotalStake, withdrawStake, getApr, getTvl } from "api/tokenManager";
import { useCallback, useState } from "react";
import Big from "big.js";
import { tokenRound } from "../helpers/calculation";

const useTokenManager = (tokenName) => {
  const { state, dispatch } = useEth();
  const { user, contracts } = state;

  const contractTokenManager = contracts["manager"];

  const contractToken = contracts[tokenName];
  const [allowanceValue, setAllowanceValue] = useState();
  const amountStaked = user && user.balanceStaked && user.balanceStaked[tokenName];

  const stake = async (stakeValue, curency) => {
    try {
      await depositStake(contractTokenManager, user.address, stakeValue.toFixed());
      await getUserTotalStake();
    } catch (error) {
      console.error(error);
    }
  };

  const withdraw = async (withDrawValue, curency) => {
    try {
      await withdrawStake(contractTokenManager, user.address, withDrawValue.toFixed());
      await getUserTotalStake();
    } catch (error) {
      console.error(error);
    }
  };

  const getApproval = async (value) => {
    try {
      await approve(contractToken, user.address, contractTokenManager._address, value.toFixed());
      setAllowanceValue(value);
      // Use event
    } catch (error) {
      console.error(error);
      throw error;
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
    if (!contractTokenManager) return;
    try {
      const logs = await userTotalStake(contractTokenManager, user.address);
      let amount = new Big(0);
      logs.forEach((element) => {
        if (element.returnValues.operation === "deposit") {
          amount = amount.plus(element.returnValues.amount);
        }
        if (element.returnValues.operation === "withdraw") {
          // element.returnValues.amount return percent of sbix used to withdraw (amount in bps => centieme de pourcentage)
          amount = amount.mul(1 - element.returnValues.amount / 10000);
        }
      });

      const data = {
        [tokenName]: amount
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

  const getPoolInfo = useCallback(async () => {
    if (!contractTokenManager) return;
    try {
      const tvl = await getTvl(contractTokenManager);
      const apr = await getApr(contractTokenManager);
      return {
        tvl: tokenRound(new Big(tvl)).toFixed(),
        apr: apr / 100
      };
    } catch (error) {
      console.error(error);
    }
  }, [contractTokenManager]);

  return {
    getAllowance,
    getApproval,
    getUserTotalStake,
    stake,
    withdraw,
    allowanceValue,
    amountStaked,
    getPoolInfo
  };
};

export default useTokenManager;
