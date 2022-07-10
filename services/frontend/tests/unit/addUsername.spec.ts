import { DeleteCommand, DeleteCommandInput } from '@aws-sdk/lib-dynamodb';
import { addUsername } from '@svc/lib/server/addUsername';
import { ddb, REGION, TableName } from '@svc/lib/server/config';
import { getUserID } from '@svc/lib/server/getUserID';

describe('addUsername', () => {
  let userIDToDelete: number;
  it('adds the username to the userID in the table, adding both if the user does not yet exist', async () => {
    const userID = await getUserID();
    userIDToDelete = userID;

    await addUsername(userID, 'testUsername');

    await expect({ region: REGION, table: TableName }).toHaveItem(
      { pk: `user#${userID}`, sk: 'details' },
      expect.objectContaining({ username: 'testUsername' }),
    );
  });

  afterAll(() => {
    const params: DeleteCommandInput = {
      Key: { pk: `user#${userIDToDelete}`, sk: 'details' },
      TableName,
    };

    return ddb.send(new DeleteCommand(params));
  });
});