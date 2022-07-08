import { BatchWriteCommand, BatchWriteCommandInput } from "@aws-sdk/lib-dynamodb"
import { addConnection } from "@svc/lib/addConnection"
import { buildWSConnectionKeys, buildUniquenessWSConnectionKeys } from "@svc/lib/buildWSConnectionKeys"
import { ddb, REGION, TableName } from "@svc/lib/config"

const table = {
  region: REGION,
  table: TableName
}

describe('addConnection', () => {
  const testWSConnection = {
    meetingID: 'testMeetingID',
    wsConnectionID: 'testWSConnectionID'
  }
  const testKeys = buildWSConnectionKeys(testWSConnection)
  const uniqKeys = buildUniquenessWSConnectionKeys(testWSConnection)
  const duplicateIDConnection = {
    meetingID: 'newmeetingID',
    wsConnectionID: testWSConnection.wsConnectionID
  }
  
  it('adds the connection item and uniqueness item to the DDB Table', async () => {
    await addConnection(testWSConnection. meetingID, testWSConnection.wsConnectionID, 'testUser')
    
    
    await expect(table).toHaveItem(testKeys, {...testKeys, ...testWSConnection, type: 'meetingConnection', email: 'testUser'})
    await expect(table).toHaveItem(uniqKeys)
  })
  
  it('does not add the item if the wsConnectionID is already in use', async () => {
    const duplicateKeys = buildWSConnectionKeys(duplicateIDConnection)    
    const addBadConnection = addConnection(duplicateIDConnection.meetingID, duplicateIDConnection.wsConnectionID, 'testUser')

    await expect(addBadConnection).rejects.toThrow()
    await expect(table).not.toHaveItem(duplicateKeys)
  })

  afterAll(() => {
    const deleteParms: BatchWriteCommandInput = {
      RequestItems: {
        [TableName]: [
          {
            DeleteRequest: {
              Key: testKeys,
            }
          },
          {
            DeleteRequest: {
              Key: uniqKeys
            }
          }
        ]
      }
    }

    return ddb.send(new BatchWriteCommand(deleteParms))
  })
})