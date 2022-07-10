import { APIGatewayEvent } from 'aws-lambda';
import log from '@dazn/lambda-powertools-logger';
import { addConnection } from '@svc/lib/addConnection';

export const handler = async (event: APIGatewayEvent) => {
  log.debug('Received event', { event });
  const meetingID = event.queryStringParameters?.meetingID;
  const email = event.queryStringParameters?.email;
  const wsConnectionID = event.requestContext.connectionId;

  try {
    if (!meetingID) throw new Error('missing meetingID');
    if (!wsConnectionID) throw new Error('missing wsConnectionID');
    if (!email) throw new Error('missing email');

    await addConnection(meetingID, wsConnectionID, email);
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