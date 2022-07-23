import { useContext } from "react";
import EthContext from "contexts/EthContext/EthContext";

const useAuth = () => {
  const {
    state: { user },
    dispatch
  } = useContext(EthContext);

  return { user, dispatch };
};

export default useAuth;
