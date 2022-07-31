import Authenticated from "pages/Authenticated/Authenticated";
import Unauthenticated from "pages/Unauthenticated";
import useAuth from "./hooks/useAuth";
import { useColorMode, Button, Box } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

import "react-toastify/dist/ReactToastify.css";
import "./App.scss";
import useWallet from "hooks/useWallet";

function App() {
  const { user } = useAuth();
  const { askAccount, getAccount } = useWallet();
  const { colorMode, toggleColorMode } = useColorMode();
  const isLightMode = colorMode === "light";

  return (
    <Box overflowX={"hidden"} maxW={"100vw"}>
      <Button pos="absolute" top="10" right="10" onClick={toggleColorMode}>
        {isLightMode ? <SunIcon /> : <MoonIcon />}
      </Button>
      <Box className="app-container">
        {user.address ? <Authenticated /> : <Unauthenticated getAccount={getAccount} askAccount={askAccount} />}
      </Box>
    </Box>
  );
}

export default App;
