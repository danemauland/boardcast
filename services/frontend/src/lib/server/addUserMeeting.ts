import { PutCommand, PutCommandInput, TransactWriteCommand } from '@aws-sdk/lib-dynamodb';
import { ddb, TableName } from './config';
import { DDBMeetingDetails, DDBUserMeeting, Meeting, MeetingDetails, UserMeeting } from '../types';
import { buildUserPK } from './buildUserKeys';

export async function addUserMeeting(meeting: UserMeeting & Pick<MeetingDetails, 'meetingID'>) {
  const userMeeting: DDBUserMeeting = {
    ...meeting,
    pk: buildUserPK(meeting.ownerEmail),
    sk: `meeting#${meeting.timestamp}`,
    type: 'userMeeting',
  };
  
  const putUserMeeting: PutCommandInput = {
    TableName,
    Item: userMeeting,
    ReturnValues: 'ALL_OLD',
  };

  const ddbMeeting: DDBMeetingDetails = {
    ...meeting,
    pk: `meeting#${meeting.meetingID}`,
    sk: 'details',
    type: 'meetingDetails',
    accessTokens: {}
  };

  const putDDBMeeting: PutCommandInput = {
    TableName,
    Item: ddbMeeting,
  };

  const params = new TransactWriteCommand({
    TransactItems: [
      { Put: putUserMeeting },
      { Put: putDDBMeeting },
    ],
  });

  return ddb.send(params);
}