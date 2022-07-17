import { BatchWriteCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { buildMessageKeys } from '@svc/lib/buildMessageKeys';
import { ddb, TableName } from '@svc/lib/config';
import { getMeetingMessages } from '@svc/lib/getMeetingMessages';
import { Message } from '@svc/lib/types';
import { randomUUID } from 'crypto';

describe('getMeetingMessages', () => {
  const createdMessages: Message[] = [];
  it('returns all the messages belonging to a meeting', async () => {
    const meetingID = 'testGetMeetingMessages';
    const promises = [];

    for (let i = 0; i < 3; i++) {
      const wsConnectionID = randomUUID();
      const message = {
        wsConnectionID,
        meetingID,
        text: 'test',
        timestamp: new Date().toISOString(),
        email: 'testUser',
      };
      promises.push(ddb.send(new PutCommand({
        TableName,
        Item: {
          ...message,
          ...buildMessageKeys(message),
        },
      })));
      createdMessages.push(message);
    }

    await Promise.all(promises);

    // eslint-disable-next-line no-await-in-loop
    const receivedMessages = await getMeetingMessages(meetingID, 1);

    expect(receivedMessages).toHaveLength(3);

    const buildExpectedMessages = (message: Message) => expect.objectContaining({
      email: message.email,
      text: message.text,
    });

    const expectedMessages = createdMessages.map(buildExpectedMessages);

    expect(receivedMessages).toStrictEqual(expect.arrayContaining(expectedMessages));
  });

  afterAll(() => ddb.send(new BatchWriteCommand({
    RequestItems: {
      [TableName]: createdMessages.map((message) => ({
        DeleteRequest: {
          TableName,
          Key: buildMessageKeys(message),
        },
      })),
    },
  })));
});
