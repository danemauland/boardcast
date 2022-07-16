import { QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { ddb } from './config';
import { TableName } from './config';
import { Message, MeetingDetails } from '../types';
import { buildUserPK } from './buildUserKeys';

type BasicMeeting = Pick<MeetingDetails, 'timestamp' | 'name' | 'meetingID'>;

// limit param is for testing purposes to ensure query pagination works
export async function getUserMeetings(email: string, limit?: number) {
  const meetings: BasicMeeting[] = [];
  let lastEvaluated;
  let queryParams: QueryCommandInput = {
    TableName,
    KeyConditionExpression: 'pk = :email and begins_with(sk, :meeting)',
    ExpressionAttributeValues: {
      ':email': buildUserPK(email),
      ':meeting': 'meeting#',
    },
    ProjectionExpression: '#timestamp, #name, #meetingID',
    ExpressionAttributeNames: {
      '#name': 'name',
      '#timestamp': 'timestamp',
      '#meetingID': 'meetingID',
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
      meetings.push(item as BasicMeeting);
    }

    lastEvaluated = results.LastEvaluatedKey;
  } while (lastEvaluated);

  return meetings;
}