import { QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { ddb, TableName } from './config';
import { buildMessagePK } from './buildMessageKeys';
import { UserMeeting } from './types';

// limit param is for testing purposes to ensure query pagination works
export async function getMeetingMessages(meetingID: string, limit?: number) {
  const messages: UserMeeting[] = [];
  let lastEvaluated;
  const queryParams: QueryCommandInput = {
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

    // eslint-disable-next-line no-await-in-loop
    const results = await ddb.send(new QueryCommand(queryParams));

    if (!results.Items) break;

    results.Items.forEach((item) => {
      messages.push(item as UserMeeting);
    });

    lastEvaluated = results.LastEvaluatedKey;
  } while (lastEvaluated);

  return messages;
}
