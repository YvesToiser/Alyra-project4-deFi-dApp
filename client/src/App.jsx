import useEth from "hooks/useEth";
import Vaults from "components/Vaults/Vaults";
import Connection from "components/Login/Login";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useColorMode, Button, Box, Text } from "@chakra-ui/react";
import { tokenRound } from "./helpers/calculation";

import "./App.scss";

function UserInformations({ address, balance, network }) {
  const roundedBalance = tokenRound(balance);

  return (
    <Box borderWidth="1px" p={8} borderRadius="20" my={20} width="30%">
      <Text>{address}</Text>
      <Text>{network}</Text>
      <Text>{roundedBalance.toFixed()} ETH</Text>
    </Box>
  );
}

function App() {
  const { colorMode, toggleColorMode } = useColorMode();
  const isLightMode = colorMode === "light";
  const { state } = useEth();
  const { network, user } = state;
  const isAuth = !!user.address;

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
      <Vaults />
    </Box>
  );
}

export default App;

// If 0 Bix Buy Byx
