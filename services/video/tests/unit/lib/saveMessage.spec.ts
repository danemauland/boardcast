import { QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { buildMessageKeys } from "@svc/lib/buildMessageKeys";
import { ddb, TableName } from "@svc/lib/config";
import { saveMessage } from "@svc/lib/saveMessage";
import { Message } from "@svc/lib/types";
import { randomUUID } from "crypto";

describe('saveMessage', () => {
  let message: Message;
  const meetingID = "testMeetingID";
  const createdMessages = []
  
  beforeEach(() => {
    const wsConnectionID = randomUUID();
    message = {
      wsConnectionID,
      meetingID,
      text: 'test',
      timestamp: new Date().toISOString(),
      email: 'testUser'
    }
    createdMessages.push(message)

    return {...message} // deconstructed so attempting to delete messages missing pk/sk attributes doesn't throw error
  })
  it('throws an error if the message is missing text', async () => {
    // @ts-expect-error
    delete message.text

    await expect(saveMessage(message)).rejects.toThrow()
  })
  it('throws an error if the message is missing wsConnectionID', async () => {
    // @ts-expect-error
    delete message.wsConnectionID

    await expect(saveMessage(message)).rejects.toThrow()
  })
  it('throws an error if the message is missing meetingID', async () => {
    // @ts-expect-error
    delete message.meetingID

    await expect(saveMessage(message)).rejects.toThrow()
  })
  it('throws an error if the message is missing timestamp', async () => {
    // @ts-expect-error
    delete message.timestamp

    await expect(saveMessage(message)).rejects.toThrow()
  })
  it('throws an error if the message is missing email', async () => {
    // @ts-expect-error
    delete message.email

    await expect(saveMessage(message)).rejects.toThrow()
  })

  describe('when two messages are saved with the same timestamp', () => {
    it('saves them both to the database by adjusting the timestamp on one of them', async () => {
      const message2 = {...message}
      await saveMessage(message)
      await saveMessage(message2)

      const keys = buildMessageKeys(message)

      const queryParams: QueryCommandInput = {
        TableName,
        KeyConditionExpression: "pk = :pk",
        FilterExpression: "wsConnectionID = :wsConnectionID",
        ExpressionAttributeValues: {
          ':wsConnectionID': message.wsConnectionID,
          ':pk': keys.pk
        }
      }

      const savedMessages = await ddb.send(new QueryCommand(queryParams))

      expect(savedMessages.Items).toHaveLength(2)
    })
  })
})