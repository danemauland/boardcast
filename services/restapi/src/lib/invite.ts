import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { MeetingDetails } from './types';
import config, { ddb, REGION, TableName } from './config';

const ses = new SESClient({ region: REGION });

export async function invite(meetingID: string, email: string) {
  const accessToken = randomUUID();

  const resp = await ddb.send(new UpdateCommand({
    TableName,
    Key: {
      pk: `meeting#${meetingID}`,
      sk: 'details',
    },
    UpdateExpression: 'SET accessTokens.#accessToken = :email',
    ExpressionAttributeNames: {
      '#accessToken': accessToken,
    },
    ExpressionAttributeValues: {
      ':email': email,
    },
    ReturnValues: 'ALL_NEW',
  }));

  const meeting = resp.Attributes as MeetingDetails;

  const meetingTime = new Date(meeting.timestamp);
  const easternTime = meetingTime.toLocaleString('en-US', { timeZone: 'America/New_York' });
  const centralTime = meetingTime.toLocaleString('en-US', { timeZone: 'America/Chicago' });
  const pacificTime = meetingTime.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });

  return ses.send(new SendEmailCommand({
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: `You have been invited to the meeting "${meeting.name}" by ${meeting.ownerEmail} at ${easternTime} ET / ${centralTime} CT / ${pacificTime} PT. To join, visit the following URL: ${config.app.URL}/meeting/${meetingID}/${accessToken}`,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `Meeting invite from ${meeting.ownerEmail}`,
      },
    },
    Source: 'danemauland@gmail.com',
  }));
}
