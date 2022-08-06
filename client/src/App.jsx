import useEth from "hooks/useEth";
import Vaults from "components/Vaults/Vaults";
import Connection from "components/Login/Login";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useColorMode, Button, Box, Text } from "@chakra-ui/react";
import { tokenRound } from "./helpers/calculation";
import { getBalance } from "./api/web3";

import "./App.scss";
import { Big } from "big.js";

function UserInformations({ address, balance, network }) {
  const roundedBalance = tokenRound(balance);

  return (
    <Box borderWidth="1px" p={8} borderRadius="20" my={20} mx="auto" width="30%">
      <Text>{address}</Text>
      <Text>{network}</Text>
      <Text>{roundedBalance.toFixed()} ETH</Text>
    </Box>
  );
}

function App() {
  const { colorMode, toggleColorMode } = useColorMode();
  const isLightMode = colorMode === "light";
  const { state, dispatch } = useEth();
  const { network, user } = state;
  const isAuth = !!user.address;

  const setUser = async (address) => {
    let balance = await getBalance(state.web3, address);

    balance = balance ? balance : new Big(0);
    dispatch({ type: "SET_USER", data: { address: address, balance: { eth: balance } } });
  };

  return (
    <Box overflowX={"hidden"} maxW={"100vw"}>
      <Button pos="absolute" top="10" right="10" onClick={toggleColorMode}>
        {isLightMode ? <SunIcon /> : <MoonIcon />}
      </Button>
      {isAuth ? (
        <UserInformations address={user.address} balance={user.balance.eth} network={network} />
      ) : (
        <Connection />
      )}
      <Vaults setUser={setUser} />
    </Box>
  );
}

export default App;

// If 0 Bix Buy Byx
