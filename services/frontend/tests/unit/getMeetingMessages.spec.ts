import { BatchWriteCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { buildMessageKeys } from "@svc/lib/server/buildMessageKeys";
import { ddb } from "@svc/lib/server/config";
import { getMeetingMessages } from "@svc/lib/server/getMeetingMessages";
import { Message } from "@svc/lib/types";
import { randomUUID } from "crypto";
import { TableName } from "../../src/lib/server/config"

describe("getMeetingMessages", () => {
  const createdMessages: Message[] = []
  it('returns all the messages belonging to a meeting', async () => {
    const meetingID = "testGetMeetingMessages";

    for (let i = 0; i < 3; i++) {
      const wsConnectionID = randomUUID();
      const message = {
        wsConnectionID,
        meetingID: meetingID,
        text: 'test',
        timestamp: new Date().toISOString(),
        email: 'testUser'
      }
      await ddb.send(new PutCommand({
        TableName,
        Item: {
          ...message,
          ...buildMessageKeys(message)
        }
      }))
      createdMessages.push(message)
    }

    const receivedMessages = await getMeetingMessages(meetingID, 1)

    expect(receivedMessages).toHaveLength(3)

    const expectedMessages = createdMessages.map((message: Message) => expect.objectContaining({email: message.email, text: message.text}))
    expect(receivedMessages).toStrictEqual(expect.arrayContaining(expectedMessages))
  })

  afterAll(() => {
    return ddb.send(new BatchWriteCommand({
      RequestItems: {
        [TableName]: createdMessages.map(message => {
          return {
            DeleteRequest: {
              TableName,
              Key: buildMessageKeys(message)
            }
          }
        })
      }
    }))
  })
})