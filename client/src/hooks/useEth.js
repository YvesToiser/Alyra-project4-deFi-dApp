import { useContext } from "react";
import EthContext from "contexts/EthContext/EthContext";

const useEth = () => useContext(EthContext);

export default useEth;
