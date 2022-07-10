import { Config } from './config';
import { Stats } from './types'

const html = ({
  stats,
  content,
  config,
  css = '',
}: {
  stats: Stats
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
      ${stats.styles.map((filename: string) => `<link rel="stylesheet" href="${config.app.DIST_URL}/${filename}" />`).join('\n')}
      <script id="config-server-side">
        window.__CONFIG__ = ${JSON.stringify(config)};
      </script>
      <script>const global = globalThis;</script>
    </head>
    <body>
      <div id="root">${content}</div>
      ${stats.scripts.map((filename: string) => `<script src="${config.app.DIST_URL}/${filename}" crossorigin></script>`).join('\n')}
    </body>
  </html>`;

export default html;