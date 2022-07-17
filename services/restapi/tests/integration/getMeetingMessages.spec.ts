import { BatchWriteCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { buildMessageKeys } from '@svc/lib/buildMessageKeys';
import config, { ddb, TableName } from '@svc/lib/config';
import { Message } from '@svc/lib/types';
import { randomUUID } from 'crypto';
import axios from 'axios';

describe('getMeetingMessages', () => {
  const createdMessages: Message[] = [];
  it('returns all the messages belonging to a meeting', async () => {
    const meetingID = 'testGetMessagesMeeting';

    for (let i = 0; i < 3; i++) {
      const wsConnectionID = randomUUID();
      const message = {
        wsConnectionID,
        meetingID,
        text: 'test',
        timestamp: new Date().toISOString(),
        email: 'testUser',
      };

      // eslint-disable-next-line no-await-in-loop
      await ddb.send(new PutCommand({
        TableName,
        Item: {
          ...message,
          ...buildMessageKeys(message),
        },
      }));
      createdMessages.push(message);
    }

    // eslint-disable-next-line no-await-in-loop
    const messageResp = await axios.get(`${config.app.URL}/meeting/${meetingID}/messages`);

    const receivedMessages = messageResp.data;

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
