import { Config } from "./config"

const html = ({
  content,
  config,
  css = ''
}: {
  content: string
  config: Omit<Config, 'userID'>
  css?: string
}): string => `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      <title>Meeting</title>
      <style id="jss-server-side">${css}</style>
      <script id="config-server-side">
        window.__CONFIG__ = ${JSON.stringify(config)};
      </script>
      <script>const global = globalThis;</script>
    </head>
    <body>
      <div id="root">${content}</div>
      <script src="${config.app.DIST_URL}/index.js" crossorigin></script>
    </body>
  </html>`

export default html