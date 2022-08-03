import { depositStake, allowance, approve, userTotalStake } from "api/tokenManager";
import useEth from "hooks/useEth";

const useTokenManager = () => {
  const { state } = useEth();
  const { user, contractTokenManager, contractToken } = state;

  const stake = async (stakeValue, curency) => {
    try {
      await depositStake(contractTokenManager, user.address, stakeValue, 18);
    } catch (error) {
      console.error(error);
    }
  };

  const getApproval = async (stakeValue, curency) => {
    try {
      await approve(contractToken, contractTokenManager._address, user.address, stakeValue);
    } catch (error) {
      console.error(error);
    }
  };

  const getAllowance = async () => {
    try {
      await allowance(contractToken, user.address);
    } catch (error) {
      console.error(error);
    }
  };

  const getUserTotalStake = async () => {
    try {
      const logs = await userTotalStake(contractTokenManager, user.address);
      console.log(logs);
    } catch (error) {
      console.error(error);
    }
  };

  return { getAllowance, getApproval, getUserTotalStake, stake };
};

export default useTokenManager;
