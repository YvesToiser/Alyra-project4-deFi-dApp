import React, { useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";
import { getBalance } from "api/web3";

import { networks } from "helpers/chainId";

function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setUser = useCallback(
    async (address) => {
      const balance = await getBalance(state.web3, address);
      dispatch({ type: "SET_USER", data: { address: address, balance: balance } });
    },
    [state.web3]
  );

  const resetUser = useCallback(() => {
    dispatch({ type: "RESET_USER" });
  }, []);

  const handleAccountsChanged = useCallback(
    (accounts) => {
      if (accounts.length === 0) {
        resetUser();
        return;
      }
      setUser(accounts[0]);
    },
    [setUser, resetUser]
  );

  const handleNetworkChange = useCallback(async (_chainId) => {
    const chainId = parseInt(_chainId, 16);

    await setUser(state.user.address);

    let network;
    if (networks.hasOwnProperty(chainId)) {
      network = networks[chainId];
    } else {
      network = "Unknown";
    }
    dispatch({ type: "SET_NETWORK", data: network });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check if the user is connected to a network
  // If not reload on network change  and set the network
  const init = useCallback(
    async (artifact, artifactToken) => {
      if (artifact && artifactToken) {
        if (!window.ethereum) return;

        const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        const networkID = await web3.eth.net.getId();
        const chainId = await web3.eth.getChainId();
        const abiTokenManager = artifact.abi;
        const abiToken = artifactToken.abi;

        handleNetworkChange(chainId.toString(16));

        let addressTokenManager, addressToken, contractTokenManager, contractToken;

        try {
          addressTokenManager = artifact.networks[networkID].address;
          addressToken = artifactToken.networks[networkID].address;
          contractTokenManager = new web3.eth.Contract(abiTokenManager, addressTokenManager);
          contractToken = new web3.eth.Contract(abiToken, addressToken);
        } catch (err) {
          console.error("Contract Error", err);
        }
        dispatch({
          type: actions.init,
          data: { artifact, web3, networkID, contractTokenManager, contractToken }
        });
      }
    },
    [handleNetworkChange]
  );

  useEffect(() => {
    try {
      const artifact = require("../../contracts/BYXStakingManager.json");
      const artifactToken = require("../../contracts/BYX.json");
      init(artifact, artifactToken);
    } catch (err) {
      console.error(err);
    }
  }, [init]);

  useEffect(() => {
    if (!window.ethereum) return;

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleNetworkChange);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleNetworkChange);
    };
  }, [handleAccountsChanged, handleNetworkChange, state.web3]);

  return (
    <EthContext.Provider
      value={{
        state,
        dispatch,
        setUser
      }}
    >
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;
