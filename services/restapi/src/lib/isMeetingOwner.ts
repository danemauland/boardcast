import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, TableName } from "./config";
import { DDBMeetingDetails } from "../types"

export async function isMeetingOwner(meetingID: string, ownerEmail: string) {
  const resp = await ddb.send(new GetCommand({
    TableName,
    Key: {
      pk: `meeting#${meetingID}`,
      sk: 'details'
    },
  }))

  const meeting = resp.Item as DDBMeetingDetails

  return meeting && meeting.ownerEmail === ownerEmail
}