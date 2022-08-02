import { depositStake } from "api/tokenManager";
import useEth from "hooks/useEth";

const useTokenManager = () => {
  const { state } = useEth();
  const { user, contractTokenManager } = state;

  const stake = (stakeValue, curency) => depositStake(contractTokenManager, user.address, stakeValue, 18);

  return { stake };
};

export default useTokenManager;
