import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export const REGION = process.env.REGION as string
export const TableName = process.env.DDB_TABLE as string
export const STAGE = process.env.STAGE as string

export const ddb = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: REGION})
)

export const apiGWBaseURL = `wss://${process.env.API_GW_DOMAIN}.execute-api.${REGION}.amazonaws.com/${STAGE}`