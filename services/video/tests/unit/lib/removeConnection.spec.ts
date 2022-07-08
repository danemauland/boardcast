import { addConnection } from "@svc/lib/addConnection"
import { buildWSConnectionKeys, buildUniquenessWSConnectionKeys } from "@svc/lib/buildWSConnectionKeys"
import { REGION, TableName } from "@svc/lib/config"
import { removeConnection } from "@svc/lib/removeConnection"

const table = {
  region: REGION,
  table: TableName
}

describe('removeConnection', () => {
  
  it('removes the connection item and uniqueness item from the DDB Table', async () => {
    const testWSConnection = {
      meetingID: 'testRemoveMeetingID',
      wsConnectionID: 'testRemoveConnectionID'
    }
    const testKeys = buildWSConnectionKeys(testWSConnection)
    const uniqKeys = buildUniquenessWSConnectionKeys(testWSConnection)

    await addConnection(testWSConnection. meetingID, testWSConnection.wsConnectionID, 'testUser')
    
    await expect(table).toHaveItem(testKeys, {...testKeys, ...testWSConnection, type: 'meetingConnection', email: 'testUser'})
    await expect(table).toHaveItem(uniqKeys)

    await removeConnection(testWSConnection.wsConnectionID)

    await expect(table).not.toHaveItem(testKeys)
    await expect(table).not.toHaveItem(uniqKeys)
  })
})