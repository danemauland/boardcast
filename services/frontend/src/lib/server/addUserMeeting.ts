import { PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb"
import { ddb, TableName } from "./config"
import { UserMeeting } from "../types"
import { buildUserPK } from "./buildUserKeys"

export async function addUserMeeting(email: string, meeting: UserMeeting) {
  const params: PutCommandInput = {
    TableName,
    Item: {
      ...meeting,
      pk: buildUserPK(email),
      sk: `meeting#${ meeting.timestamp }`,
      type: 'userMeeting'
    },
    ReturnValues: "ALL_OLD",
  }

  const userMeeting = await ddb.send(new PutCommand(params))

  return userMeeting
}