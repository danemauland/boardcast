import { TransactWriteCommand, TransactWriteCommandInput } from "@aws-sdk/lib-dynamodb"
import { ddb, TableName } from "./config"
import { buildWSConnectionKeys, buildUniquenessWSConnectionKeys } from "./buildWSConnectionKeys"
import { getMeetingConnectionByConnectionID } from "./getMeetingConnectionByConnectionID"

export const removeConnection = async (wsConnectionID: string) => {
  const connection = await getMeetingConnectionByConnectionID(wsConnectionID)
  
  if (!connection) throw new Error("missing connection");

  const meetingID = connection?.meetingID

  if (!meetingID) return

  const transactWriteParams: TransactWriteCommandInput = {
    TransactItems: [
      {
        Delete: {
          TableName,
          Key: buildWSConnectionKeys({meetingID, wsConnectionID})
        },
      },
      {
        Delete: {
          TableName,
          Key: buildUniquenessWSConnectionKeys({wsConnectionID}),
        }
      }
    ]
  }

  return ddb.send(new TransactWriteCommand(transactWriteParams))
}