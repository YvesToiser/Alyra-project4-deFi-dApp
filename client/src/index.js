import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { EthProvider } from "contexts/EthContext";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import theme from "./theme";
import "react-toastify/dist/ReactToastify.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <EthProvider>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <App />
      </EthProvider>
    </ChakraProvider>
  </React.StrictMode>
);
