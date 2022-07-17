import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { S3Client } from '@aws-sdk/client-s3';

export const TableName = process.env.DDB_TABLE as string;
export const REGION = process.env.REGION as string;
export const STAGE = process.env.STAGE as string;
export const Bucket = process.env.S3_BUCKET;

export const ddb = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: REGION }),
);

export const s3 = new S3Client({ region: REGION });

const isLocal = process.env.IS_LOCAL || process.env.IS_OFFLINE;

export const websocketURL = `wss://${process.env.WEBSOCKET_DOMAIN}.execute-api.${REGION}.amazonaws.com/${STAGE}`;

const config = {
  app: {
    URL: isLocal ? 'http://localhost:3000/dev' : String(process.env.API_GW_URL),
    WEBSOCKET_URL: websocketURL,
    DIST_URL: isLocal ? 'http://localhost:8080' : String(process.env.APP_DIST_URL),
    USER_POOL_ID: process.env.USER_POOL_ID,
    CLIENT_ID: process.env.CLIENT_ID,
    STAGE,
    REGION,
  } as const,
};

export type Config = typeof config & { userID?: number, meetingID?: string };
export default config;
