import { renderToString } from "react-dom/server"
import ConfigContext from "../components/ConfigContext"
import App from '../App'
import html from "./html"
import * as React from "react"
import config from "./config"
import { StaticRouter } from "react-router-dom/server"

export default async function render(userID: number, url: string): Promise<string> {
  const configWithID = {...config, userID}
  const content = renderToString(
    <ConfigContext.Provider value={configWithID}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </ConfigContext.Provider>
  )


  return html({content, config: configWithID})
}