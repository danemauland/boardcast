import {
  PostToConnectionCommand,
  ApiGatewayManagementApiClient,
} from '@aws-sdk/client-apigatewaymanagementapi';
import { QueryCommand, QueryCommandInput, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { buildWSConnectionKeys, buildWSConnectionPK } from './buildWSConnectionKeys';
import { ddb, REGION, TableName } from './config';
import { Message } from './types';

const API_ID = process.env.API_GW_DOMAIN;
const STAGE = process.env.STAGE;

const websocketClient = new ApiGatewayManagementApiClient({
  endpoint: `https://${API_ID}.execute-api.${REGION}.amazonaws.com/${STAGE}`,
  region: REGION,
});

const textEncoder = new TextEncoder();

// limit param is for testing purposes to ensure query pagination works
const getChatroomConnections = async (meetingID: string, limit?: number) => {
  const wsConnectionIDs: string[] = [];
  let lastEvaluated;
  const queryParams: QueryCommandInput = {
    TableName,
    KeyConditionExpression: 'pk = :meetingID and begins_with(sk, :connection)',
    ExpressionAttributeValues: {
      ':meetingID': buildWSConnectionPK(meetingID),
      ':connection': 'wsConnection#',
    },
    ProjectionExpression: 'wsConnectionID',
  };

  if (limit) queryParams.Limit = limit;

  do {
    if (lastEvaluated) {
      queryParams.ExclusiveStartKey = lastEvaluated;
    }

    // eslint-disable-next-line no-await-in-loop
    const results = await ddb.send(new QueryCommand(queryParams));

    if (!results.Items) break;

    results.Items.forEach((item) => {
      wsConnectionIDs.push(item.wsConnectionID);
    });

    lastEvaluated = results.LastEvaluatedKey;
  } while (lastEvaluated);

  return wsConnectionIDs;
};

// limit param is for testing purposes to ensure query pagination works
export const broadcastMessage = async (message: Message, limit?: number) => {
  const meetingConnections = await getChatroomConnections(message.meetingID, limit);

  const promises = meetingConnections.map(async (ConnectionId) => {
    const params = new PostToConnectionCommand({
      ConnectionId,
      Data: textEncoder.encode(JSON.stringify(message)),
    });

    try {
      await websocketClient.send(params);
    } catch (e) {
      if ((e as any).statusCode === 410) { // stale connection
        await ddb.send(new DeleteCommand({
          TableName,
          Key: buildWSConnectionKeys({
            wsConnectionID: ConnectionId,
            meetingID: message.meetingID,
          }),
        }));
      } else throw e;
    }
  });

  return Promise.all(promises);
};
