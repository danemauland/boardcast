import { GetObjectCommand } from '@aws-sdk/client-s3';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import { AgendaItem, Attachment, DDBAgendaItem } from './types';
import {
  Bucket, ddb, s3, TableName,
} from './config';

export async function addAgendaItem(agendaItem: AgendaItem) {
  const agendaID = agendaItem.agendaID || randomUUID();
  const ddbAgendaItem: DDBAgendaItem = {
    agendaID,
    ...agendaItem,
    pk: `meeting#${agendaItem.meetingID}`,
    sk: `agendaItem#${agendaID}`,
    type: 'agendaItem',
  };

  ddbAgendaItem.attachments.forEach(async (attachment) => {
    const command = new GetObjectCommand({ Key: attachment.s3Key, Bucket });
    // eslint-disable-next-line no-param-reassign
    (attachment as Attachment).url = await getSignedUrl(s3, command);
  });

  await ddb.send(new PutCommand({
    TableName,
    Item: ddbAgendaItem,
  }));

  return ddbAgendaItem;
}
