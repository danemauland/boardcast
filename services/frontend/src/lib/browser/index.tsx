import './index.css';

import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import ConfigContext from '../components/ConfigContext';
import App from '../App';
import { Account } from '../components/Account';
import config from "./getConfig"

const render = () => {
  const root = document.getElementById('root');
  if (!root) throw new Error('root not found');
  
  hydrateRoot(
    root,
    <ConfigContext.Provider value={config()}>
      <Account>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Account>
    </ConfigContext.Provider>
  );
};

render();
