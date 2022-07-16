import './index.css';
import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';
import getConfig from "../getConfig"
import ConfigContext from '../components/context/ConfigContext';
import { Account } from '../components/context/Account';

const render = () => {
  const root = document.getElementById('root');
  if (!root) throw new Error('root not found');
  
  hydrateRoot(
    root,
    <ConfigContext.Provider value={getConfig()}>
      <Account>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Account>
    </ConfigContext.Provider>
  );
};

render();
