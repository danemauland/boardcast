import { QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { ddb, TableName } from './config';
import { buildWSConnectionSK } from './buildWSConnectionKeys';

export async function getMeetingConnectionByConnectionID(wsConnectionID: string) {
  const queryParams: QueryCommandInput = {
    TableName,
    IndexName: 'gsi_1',
    KeyConditionExpression: 'sk = :wsConnectionID',
    ExpressionAttributeValues: {
      ':wsConnectionID': buildWSConnectionSK(wsConnectionID),
    },
  };

  const meetingConnectionResp = await ddb.send(new QueryCommand(queryParams));

  if (!meetingConnectionResp.Items) return null;

  const meetingConnection = meetingConnectionResp.Items[0];

  if (!meetingConnection) return null;

  return meetingConnection as { meetingID: string, email: string };
}
