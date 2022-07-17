import { QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { ddb } from './config';
import { buildMessagePK } from './buildMessageKeys';
import { TableName } from './config';
import { Message, UserMeeting } from '../types';

// limit param is for testing purposes to ensure query pagination works
export async function getMeetingMessages(meetingID: string, limit?: number) {
  const messages: UserMeeting[] = [];
  let lastEvaluated;
  let queryParams: QueryCommandInput = {
    TableName,
    KeyConditionExpression: 'pk = :meetingID and begins_with(sk, :message)',
    ExpressionAttributeValues: {
      ':meetingID': buildMessagePK({ meetingID }),
      ':message': 'message#',
    },
    ProjectionExpression: 'email, #text',
    ExpressionAttributeNames: {
      '#text': 'text',
    },
  };

  if (limit) queryParams.Limit = limit;

  do {
    if (lastEvaluated) {
      queryParams.ExclusiveStartKey = lastEvaluated;
    }

    const results = await ddb.send(new QueryCommand(queryParams));

    if (!results.Items) break;

    for (let item of results.Items) {
      messages.push(item as UserMeeting);
    }

    lastEvaluated = results.LastEvaluatedKey;
  } while (lastEvaluated);

  return messages;
}