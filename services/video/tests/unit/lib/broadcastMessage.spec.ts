import { addConnection } from '@svc/lib/addConnection';
import { buildWSConnectionKeys } from '@svc/lib/buildWSConnectionKeys';
import { removeConnection } from '@svc/lib/removeConnection';
import { broadcastMessage } from '@svc/lib/broadcastMessage';

const mockSend = jest.fn();

jest.mock('@aws-sdk/client-apigatewaymanagementapi', () => {
  const original = jest.requireActual('@aws-sdk/client-apigatewaymanagementapi');
  return {
    ...original,
    __esModule: true,
    ApiGatewayManagementApiClient: jest.fn().mockImplementation(() => {
      return {
        send: (...args: any) => mockSend(...args),
      };
    }),
  };
});

describe('broadcastMessage', () => {
  const meetingConnections: { meetingID: string, wsConnectionID: string, pk: string, sk: string }[] = [];
  it('sends the message and email to all connections in the database matching the meetingID', async () => {
    const meetingID = 'testSendMessage';
    const testText = 'testMessage';
    const testEmail = 'testUser';
    
    for (let i = 0; i < 3; i++) {
      const newConnection = {
        meetingID,
        wsConnectionID: String(i),
      };
      
      meetingConnections.push({ ...newConnection, ...buildWSConnectionKeys(newConnection) });
    }

    const testMessage = { wsConnectionID: meetingConnections[0].wsConnectionID, meetingID, text: testText, email: testEmail, timestamp: new Date().toISOString() };
    const testMessageEncoded = new TextEncoder().encode(JSON.stringify(testMessage));

    const promises = meetingConnections.map(connection => addConnection(connection.meetingID, connection.wsConnectionID, 'testUser'));

    await Promise.all(promises);

    await broadcastMessage(testMessage, 1);

    expect(mockSend).toHaveBeenCalledTimes(3);
    for (let connection of meetingConnections) {
      expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({ input: { ConnectionId: connection.wsConnectionID, Data: testMessageEncoded } }));
    }
  });

  afterAll(() => {
    return Promise.all(meetingConnections.map(connection => removeConnection(connection.wsConnectionID)));
  });
});