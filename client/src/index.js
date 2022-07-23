import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { EthProvider } from "contexts/EthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <EthProvider>
      <App />
    </EthProvider>
  </React.StrictMode>
);
