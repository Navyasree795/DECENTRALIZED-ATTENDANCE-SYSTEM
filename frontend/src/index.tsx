import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PetraWalletName } from "petra-plugin-wallet-adapter";

const wallets = [PetraWalletName];

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <AptosWalletAdapterProvider optInWallets={wallets} autoConnect={true}>
      <App />
    </AptosWalletAdapterProvider>
  </React.StrictMode>
);