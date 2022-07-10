import { UpdateCommand, UpdateCommandInput } from '@aws-sdk/lib-dynamodb';
import { ddb, TableName } from '@svc/lib/server/config';

export async function addUsername(userID: number, username: string) {
  const params: UpdateCommandInput = {
    TableName,
    Key: {
      pk: `user#${userID}`,
      sk: 'details',
    },
    UpdateExpression: 'SET username = :username',
    ExpressionAttributeValues: {
      ':username': username,
    },
    ReturnValues: 'UPDATED_NEW',
  };

  const user = await ddb.send(new UpdateCommand(params));

  return user.Attributes!.username;
}