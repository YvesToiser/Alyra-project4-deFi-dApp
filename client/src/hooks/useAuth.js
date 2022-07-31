import useEth from "hooks/useEth";

const useAuth = () => {
  const { state, dispatch } = useEth();

  const { user } = state;

  return { user, dispatch };
};

export default useAuth;
