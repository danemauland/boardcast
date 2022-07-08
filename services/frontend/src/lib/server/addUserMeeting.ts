import { PutCommand, PutCommandInput, TransactWriteCommand } from "@aws-sdk/lib-dynamodb"
import { ddb, TableName } from "./config"
import { DDBMeeting, DDBUserMeeting, Meeting, UserMeeting } from "../types"
import { buildUserPK } from "./buildUserKeys"

export async function addUserMeeting(meeting: UserMeeting) {
  const userMeeting: DDBUserMeeting = {
    ...meeting,
    pk: buildUserPK(meeting.ownerEmail),
    sk: `meeting#${meeting.timestamp}`,
    type: 'userMeeting'
  }
  
  const putUserMeeting: PutCommandInput = {
    TableName,
    Item: userMeeting,
    ReturnValues: "ALL_OLD",
  }

  const ddbMeeting: DDBMeeting = {
    ...meeting,
    pk: `meeting#${meeting.uuid}`,
    sk: 'details',
    type: 'meeting'
  }

  const putDDBMeeting: PutCommandInput = {
    TableName,
    Item: ddbMeeting
  }

  const params = new TransactWriteCommand({
    TransactItems: [
      {Put: putUserMeeting},
      {Put: putDDBMeeting}
    ]
  })

  return userMeeting
}