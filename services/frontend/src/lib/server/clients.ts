import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { S3Client } from '@aws-sdk/client-s3';
import getConfig from '../getConfig';

const { REGION } = getConfig().app;

export const ddb = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: REGION }),
);

export const s3 = new S3Client({ region: REGION });
