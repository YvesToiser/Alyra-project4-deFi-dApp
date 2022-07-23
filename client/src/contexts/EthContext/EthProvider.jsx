import React, { useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";

import { networks } from "helpers/chainId";

function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const init = useCallback(async (artifact) => {
    if (artifact) {
      const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
      const networkID = await web3.eth.net.getId();
      const { abi } = artifact;
      let address, contract;
      try {
        address = artifact.networks[networkID].address;
        contract = new web3.eth.Contract(abi, address);
      } catch (err) {
        console.error("Contract not found");
      }
      dispatch({
        type: actions.init,
        data: { artifact, web3, networkID, contract }
      });
    }
  }, []);

  const tryInit = useCallback(async () => {
    try {
      const artifact = require("../../contracts/SimpleStorage.json");
      init(artifact);
    } catch (err) {
      console.error(err);
    }
  }, [init]);

  useEffect(() => {
    tryInit();
  }, [tryInit]);

  const setUserAdressAndBalance = useCallback(async (address) => {
    //getBalance
    dispatch({ type: "SET_USER", data: { address: address }, balance: 0 });
  }, []);

  const resetUser = useCallback(() => {
    dispatch({ type: "RESET_USER" });
  }, []);

  const handleAccountsChanged = useCallback(
    (accounts) => {
      if (accounts.length === 0) {
        resetUser();
        return;
      }
      setUserAdressAndBalance(accounts[0]);
    },
    [setUserAdressAndBalance, resetUser]
  );

  const handleNetworkChange = useCallback((_chainId) => {
    const chainId = parseInt(_chainId, 16);
    const network = networks.find((network) => network.chainId === chainId);
    console.log(network.name);
  }, []);

  useEffect(() => {
    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleNetworkChange);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleNetworkChange);
    };
  }, [handleAccountsChanged, handleNetworkChange]);

  return (
    <EthContext.Provider
      value={{
        state,
        dispatch
      }}
    >
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;
