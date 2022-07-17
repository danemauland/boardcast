import { DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { ddb, TableName } from './config';

export async function deleteAgendaItem(meetingID: string, agendaID: string) {
  await ddb.send(new DeleteCommand({
    TableName,
    Key: {
      pk: `meeting#${meetingID}`,
      sk: `agendaItem#${agendaID}`,
    },
  }));
}
