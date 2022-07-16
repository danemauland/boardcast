import { Config } from "./types"

let config: Config; 

export default function() {

  if (typeof window === 'undefined') {
    const isLocal = process.env.IS_LOCAL || process.env.IS_OFFLINE;

    const REGION = process.env.REGION as string;
    const STAGE = process.env.STAGE as string;

    const WEBSOCKET_URL = `wss://${process.env.WEBSOCKET_DOMAIN}.execute-api.${REGION}.amazonaws.com/${STAGE}`;
    config = {
      app: {
        URL: isLocal ? `http://localhost:3000/dev` : String(process.env.API_GW_URL),
        WEBSOCKET_URL,
        DIST_URL: isLocal ? `http://localhost:8080` : String(process.env.APP_DIST_URL),
        USER_POOL_ID: process.env.USER_POOL_ID!,
        CLIENT_ID: process.env.CLIENT_ID!,
        STAGE,
        REGION,
      } as const,
    };
  } else {
    // needs to lazy initialize because react strict mode renders components twice, so second render 
    // config gets set to undefined because it was deleted from window in first render
    config ||= (window as any).__CONFIG__;

    console.log({configFromWindow: config})
    delete (window as any).__CONFIG__;
  }

  return config
}