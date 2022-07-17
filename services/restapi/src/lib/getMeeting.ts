import { QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
// import { STSClient } from '@aws-sdk/client-sts';
import { getNewUploadURL } from './getNewUploadURL';
// import config, {
import {
  ddb, s3, TableName, Bucket,
} from './config';
import {
  AgendaItem, Attachment, DDBAgendaItem, DDBMeetingDetails, DDBMessage, Meeting, Upload,
} from './types';

// const sts = new STSClient({ region: config.app.REGION });

async function buildUpload(meetingID: string): Promise<Upload> {
  const s3Key = `${meetingID}/${randomUUID()}`;
  const url = await getNewUploadURL(s3Key);

  return { url, s3Key };
}

async function getAgendaItems(meetingItems: { [key: string]: any }[]) {
  const promises: Promise<any>[] = [];
  const agendaItems = (meetingItems
    .filter((item) => item.type === 'agendaItem') as DDBAgendaItem[])
    .sort((itemA, itemB) => itemA.orderNum - itemB.orderNum);

  agendaItems.forEach((agendaItem) => {
    for (let i = 0; i < agendaItem.attachments.length; i++) {
      const attachment = agendaItem.attachments[i];

      promises.push(getSignedUrl(s3, new GetObjectCommand({ Key: attachment.s3Key, Bucket }))
        .then((url) => {
          const newAttachment: Attachment = { ...attachment, url };
          // eslint-disable-next-line no-param-reassign
          (agendaItem as unknown as AgendaItem).attachments[i] = newAttachment;
        }));
    }
  });

  await Promise.all(promises);

  return agendaItems;
}

// limit param is for testing purposes to ensure query pagination works
async function getMeetingItems(meetingID: string, limit?: number) {
  const items: ({ [key: string]: any })[] = [];
  let lastEvaluated;
  const queryParams: QueryCommandInput = {
    TableName,
    KeyConditionExpression: 'pk = :meetingID',
    ExpressionAttributeValues: {
      ':meetingID': `meeting#${meetingID}`,
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
      items.push(item);
    });

    lastEvaluated = results.LastEvaluatedKey;
  } while (lastEvaluated);

  return items;
}

export async function getMeeting(
  meetingID: string,
  uuid: string,
  isOwner = false,
  limit?: number,
): Promise<Meeting> {
  const meetingItems = await getMeetingItems(meetingID, limit);

  const messages = meetingItems.filter((item) => item.type === 'message') as DDBMessage[];
  const agendaItems = await getAgendaItems(meetingItems);
  const meetingDetails = meetingItems.find((item) => item.type === 'meetingDetails') as DDBMeetingDetails;

  if (!meetingDetails) throw new Error('missing meetingDetails');

  const meeting: Meeting = {
    meetingDetails, agendaItems: agendaItems as unknown as AgendaItem[], messages, upload: null,
  };

  if (isOwner) {
    meeting.upload = await buildUpload(meetingID);
  }

  // const assumeRoleOutput = await sts.send(new AssumeRoleCommand({
  //   DurationSeconds: 60 * 60,
  //   RoleArn: process.env.KINESIS_ROLE,
  //   ExternalId: uuid,
  //   RoleSessionName: meetingID + '_' + uuid
  // }))

  // meeting.credentials = assumeRoleOutput.Credentials!

  return meeting;
}
