import useAuth from "./hooks/useAuth";
import useEth from "hooks/useEth";

import Vaults from "components/Vaults/Vaults";
import Unauthenticated from "components/Login/Login";

import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useColorMode, Button, Box, Text } from "@chakra-ui/react";

import "./App.scss";

function UserInformations({ address, balance, network }) {
  return (
    <Box borderWidth="1px" p={8} borderRadius="20" my={20} width="30%">
      <Text>{address}</Text>
      <Text>{network}</Text>
      <Text>{balance.eth} ETH</Text>
    </Box>
  );
}

function App() {
  const { user } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();
  const isLightMode = colorMode === "light";
  const isAuth = !!user.address;
  const { state } = useEth();

  const { network } = state;

  return (
    <Box overflowX={"hidden"} maxW={"100vw"}>
      <Button pos="absolute" top="10" right="10" onClick={toggleColorMode}>
        {isLightMode ? <SunIcon /> : <MoonIcon />}
      </Button>
      {isAuth ? (
        <UserInformations address={user.address} balance={user.balance} network={network} />
      ) : (
        <Unauthenticated />
      )}

      <Box className="app-container">
        <Vaults />
      </Box>
    </Box>
  );
}

export default App;

// If 0 Bix Buy Byx
