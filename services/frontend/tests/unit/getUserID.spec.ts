import { GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb"
import { ddb, TableName } from "@svc/lib/server/config"
import { getUserID } from "@svc/lib/server/getUserID"

describe('getUserID', () => 
  it('returns an incremented count of the total number of users', async () => {
    const counter = await ddb.send(new GetCommand({
      TableName,
      Key: {
        pk: 'users',
        sk: 'count'
      }
    }))

    const newUserID = await getUserID()

    expect(newUserID).toBeGreaterThan(counter.Item!.count)
  })
)