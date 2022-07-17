import { TransactWriteCommand, TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb';
import { ddb, TableName } from './config';
import { buildWSConnectionKeys, buildUniquenessWSConnectionKeys } from './buildWSConnectionKeys';

export const addConnection = (meetingID: string, wsConnectionID: string, email: string) => {
  const transactWriteParams: TransactWriteCommandInput = {
    TransactItems: [
      {
        Put: {
          TableName,
          Item: {
            meetingID,
            wsConnectionID,
            email,
            ...buildWSConnectionKeys({ meetingID, wsConnectionID }),
            type: 'meetingConnection',
          },
        },
      },
      {
        Put: {
          TableName,
          Item: buildUniquenessWSConnectionKeys({ wsConnectionID }),
          ConditionExpression: 'attribute_not_exists(pk)',
        },
      },
    ],
  };

  return ddb.send(new TransactWriteCommand(transactWriteParams));
};
