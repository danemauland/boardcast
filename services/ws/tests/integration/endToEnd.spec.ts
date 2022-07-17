import { randomUUID } from 'crypto';
import {
  apiGWBaseURL, ddb, REGION, TableName,
} from '@svc/lib/config';
import { buildLambdaName } from '@tests/utils/buildLambdaName';
import { QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import WebSocket from 'ws';
import { buildWSConnectionKeys, buildWSConnectionPK } from '@svc/lib/buildWSConnectionKeys';
import { buildMessagePK, buildMessageSK } from '@svc/lib/buildMessageKeys';
import { Message } from '@svc/lib/types';

const connectLambdaLogs = {
  region: REGION,
  function: buildLambdaName('WSConnect'),
  timeout: 30000,
};

const disconnectLambdaLogs = {
  ...connectLambdaLogs,
  function: buildLambdaName('WSDisconnect'),
};

const textDecoder = new TextDecoder();

describe('connect and disconnect', () => {
  // @ts-expect-error
  const testMessage: Message = {
    meetingID: randomUUID(),
    text: 'testMessage',
    email: 'testUser1',
  };
  const websocket = new WebSocket(`${apiGWBaseURL}?meetingID=${testMessage.meetingID}&email=testUser1`);
  const websocket2 = new WebSocket(`${apiGWBaseURL}?meetingID=${testMessage.meetingID}&email=testUser2`);

  let receivedMessage: string;
  let receivedEmail: string;

  websocket2.on('message', (data: Uint8Array) => {
    const parsed = JSON.parse(textDecoder.decode(data)) as Message;
    receivedMessage = parsed.text;
    receivedEmail = parsed.email;
  });

  describe('connect', () => {
    it('is invoked when a connection is established', async () => {
      await expect(connectLambdaLogs).toHaveLog(testMessage.meetingID);
    });

    it('adds the connection to the DDB table', async () => {
      const params: QueryCommandInput = {
        TableName,
        KeyConditionExpression: 'pk = :pk',
        FilterExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':pk': buildWSConnectionPK(testMessage.meetingID),
          ':email': 'testUser1',
        },
      };

      const resp = await ddb.send(new QueryCommand(params));

      const meetingConnection = resp.Items![0];

      testMessage.wsConnectionID = meetingConnection.wsConnectionID;
      expect(meetingConnection.meetingID).toBe(testMessage.meetingID);
    });
  });

  describe('saveMessage', () => {
    it('saves the message received from the websocket to the database', async () => {
      websocket.send(JSON.stringify({ action: 'sendMessage', text: testMessage.text, email: testMessage.email }));

      await new Promise((r) => { setTimeout(r, 5000); }); // give time for websocket to be received

      const returnedMessages = (await ddb.send(new QueryCommand({
        TableName,
        KeyConditionExpression: 'pk = :pk and begins_with(sk, :sk)',
        ExpressionAttributeValues: {
          ':pk': buildMessagePK(testMessage),
          ':sk': buildMessageSK({ timestamp: new Date().toISOString().slice(0, 15) }), // datetime string but without seconds/first minute digit
        },
      }))).Items;

      expect(returnedMessages).toHaveLength(1);

      const returnedMessage = returnedMessages![0];

      expect(returnedMessage).toStrictEqual(expect.objectContaining(testMessage));
    });
  });

  describe('broadcastMessage', () => {
    it('broadcasts a message to all connections under that meeting after the message is saved to the database', async () => {
      expect(receivedMessage).toBe('testMessage');
      expect(receivedEmail).toBe('testUser1');
    });
  });

  describe('disconnect', () => {
    it('is invoked when a connection disconnects', async () => {
      await websocket.close();
      await expect(disconnectLambdaLogs).toHaveLog(testMessage.wsConnectionID);
    });

    it('removes the connection from the database', async () => {
      const ddbTable = { region: REGION, table: TableName };
      // testMessage contains all info needed to build respective connection keys
      await expect(ddbTable).not.toHaveItem(buildWSConnectionKeys(testMessage));
    });
  });

  afterAll(() => websocket2.close());
});
