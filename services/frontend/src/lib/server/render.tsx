import { renderToString } from 'react-dom/server';
import ConfigContext from '../components/context/ConfigContext';
import App from '../App';
import html from './html';
import * as React from 'react';
import { StaticRouter } from 'react-router-dom/server';
import { Stats } from '../types';
import { Account } from '../components/context/Account';
import getConfig from '../getConfig';

export default async function render(url: string): Promise<string> {
  const stats = (await import("../../../dist/stats.json")) as unknown as Stats;
  const config = getConfig()
  console.log({config})
  
  const content = renderToString(
    <ConfigContext.Provider value={config}>
      <Account>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
      </Account>
    </ConfigContext.Provider>,
  );

  return html({ content, config, stats });
}