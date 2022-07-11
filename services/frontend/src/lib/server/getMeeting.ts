import { QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { AgendaItem, Attachment, DDBAgendaItem, DDBMeetingDetails, DDBMessage, Meeting, Upload } from "../types";
import { ddb, s3, TableName, Bucket } from "./config";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3"
import { randomUUID } from "crypto";
import { getNewUploadURL } from "./getNewUploadURL";

export async function getMeeting(meetingID: string, isOwner = false, limit?: number): Promise<Meeting> {
  const meetingItems = await getMeetingItems(meetingID, limit)

  const messages = meetingItems.filter(item => item.type === 'message') as DDBMessage[]
  const agendaItems = await getAgendaItems(meetingItems)
  const meetingDetails = meetingItems.find(item => item.type === 'meetingDetails') as DDBMeetingDetails

  if (!meetingDetails) throw new Error("missing meetingDetails");
  
  const meeting: Meeting = { meetingDetails, agendaItems: agendaItems as unknown as AgendaItem[], messages, upload: null}
  
  if (isOwner) {
    meeting.upload = await buildUpload(meetingID)
  }

  console.log({meeting})

  return meeting
}

async function buildUpload(meetingID: string): Promise<Upload> {
  const s3Key = `${meetingID}/${randomUUID()}`
  const url = await getNewUploadURL(s3Key)

  return {url, s3Key}
}

async function getAgendaItems(meetingItems: { [key: string]: any }[] ) {
  const agendaItems = (meetingItems
    .filter(item => item.type === 'agendaItem') as DDBAgendaItem[])
    .sort((itemA, itemB) => itemA.orderNum - itemB.orderNum)

  for(let agendaItem of agendaItems) {
    for(let i = 0; i < agendaItem.attachments.length; i++) {
      const attachment = agendaItem.attachments[i];
      const url = await getSignedUrl(s3, new GetObjectCommand({Key: attachment.s3Key, Bucket}));
      const newAttachment: Attachment = {...attachment, url};


      (agendaItem as unknown as AgendaItem).attachments[i] = newAttachment
    }
  }

  return agendaItems
}

// limit param is for testing purposes to ensure query pagination works
async function getMeetingItems(meetingID: string, limit?: number) {
  const items: ({[key: string]: any})[] = [];
  let lastEvaluated;
  let queryParams: QueryCommandInput = {
    TableName,
    KeyConditionExpression: 'pk = :meetingID',
    ExpressionAttributeValues: {
      ':meetingID': `meeting#${meetingID}`
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
      items.push(item)
    }

    lastEvaluated = results.LastEvaluatedKey;
  } while (lastEvaluated);

  return items;
}