import "./index.css";

import React from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import ConfigContext from "../components/ConfigContext";
import { Config } from "../server/config";
import App from "../App";

const config = (window as any).__CONFIG__ as Config;
delete (window as any).__CONFIG__;

const render = () => {
  const root = document.getElementById("root")
  if (!root) throw new Error("root not found");
  
  hydrateRoot(
    root,
    <>
      <ConfigContext.Provider value={config}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConfigContext.Provider>
    </>,
  );
};

render();
