import { UpdateCommand, UpdateCommandInput } from "@aws-sdk/lib-dynamodb"
import { ddb, TableName } from "./config"

export const getUserID = async (): Promise<number> => {
  const params: UpdateCommandInput = {
    Key: {
      pk: 'users',
      sk: 'count',
    },
    UpdateExpression: "ADD #count :val",
    ExpressionAttributeNames: {
      '#count': 'count'
    },
    ExpressionAttributeValues: {
      ':val': 1
    },
    ReturnValues: 'UPDATED_NEW',
    TableName,
  }

  const returnVal = await ddb.send(new UpdateCommand(params))

  return returnVal.Attributes!.count
}