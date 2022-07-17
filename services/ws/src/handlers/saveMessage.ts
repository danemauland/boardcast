import { APIGatewayEvent } from 'aws-lambda';
import log from '@dazn/lambda-powertools-logger';
import { getMeetingConnectionByConnectionID } from '@svc/lib/getMeetingConnectionByConnectionID';
import { saveMessage } from '@svc/lib/saveMessage';

export const handler = async (event: APIGatewayEvent) => {
  log.debug('Received event', { event });
  const wsConnectionID = event.requestContext.connectionId;

  try {
    if (!wsConnectionID) throw new Error('missing wsConnectionID');
    const receivedMessage = JSON.parse(event.body!);
    const connection = await getMeetingConnectionByConnectionID(wsConnectionID);

    if (!connection) throw new Error('connection not found');

    const message = {
      ...receivedMessage,
      meetingID: connection.meetingID,
      timestamp: new Date().toISOString(),
      wsConnectionID,
    };
    log.debug('saving message', { messageToSave: message });
    await saveMessage(message);
  } catch (e) {
    log.error('error', e as Error);
    return {
      statusCode: 500,
      body: `Connection Failed: ${JSON.stringify(e, Object.getOwnPropertyNames(e))}`,
    };
  }

  return {
    statusCode: 200,
    body: 'Connection Successful',
  };
};
