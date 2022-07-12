import { Config } from "../server/config";
import serverConfig from '../server/config';

let config: Config;

export default function() {
  if (typeof window === 'undefined') {
    const REGION = process.env.REGION as string;
    const STAGE = process.env.STAGE as string;

    const websocketURL = `wss://${process.env.WEBSOCKET_DOMAIN}.execute-api.${REGION}.amazonaws.com/${STAGE}`;
    config = {
      app: {
        URL: String(process.env.API_GW_URL),
        WEBSOCKET_URL: websocketURL,
        DIST_URL: String(process.env.APP_DIST_URL),
        USER_POOL_ID: process.env.USER_POOL_ID,
        CLIENT_ID: process.env.CLIENT_ID,
        STAGE,
        REGION,
      } as const,
    };
  } else {
    config ||= (window as any).__CONFIG__ as Config;
    delete (window as any).__CONFIG__;
  }

  return config
}