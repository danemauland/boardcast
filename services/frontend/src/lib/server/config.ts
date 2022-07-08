import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export const TableName = process.env.DDB_TABLE as string
export const REGION = process.env.REGION as string
export const STAGE = process.env.STAGE as string

export const ddb = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: REGION})
)

export const websocketURL = `wss://${process.env.WEBSOCKET_DOMAIN}.execute-api.${REGION}.amazonaws.com/${STAGE}`

const config = {
  app: {
    URL: String(process.env.API_GW_URL),
    WEBSOCKET_URL: websocketURL,
    DIST_URL: String(process.env.APP_DIST_URL),
    USER_POOL_ID: process.env.USER_POOL_ID,
    CLIENT_ID: process.env.CLIENT_ID,
    STAGE,
  } as const
}

export type Config = typeof config & { userID: number, meetingID?: string }
export default config