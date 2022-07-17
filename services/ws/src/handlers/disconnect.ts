import { APIGatewayEvent } from 'aws-lambda';
import log from '@dazn/lambda-powertools-logger';
import { removeConnection } from '@svc/lib/removeConnection';

export const handler = async (event: APIGatewayEvent) => {
  log.debug('Received event', { event });
  const wsConnectionID = event.requestContext.connectionId;

  try {
    if (!wsConnectionID) throw new Error('missing wsConnectionID');

    await removeConnection(wsConnectionID);
  } catch (e) {
    log.error('error', e as Error);
    return {
      statusCode: 500,
      body: `disconnect failed: ${JSON.stringify(e, Object.getOwnPropertyNames(e))}`,
    };
  }

  return {
    statusCode: 200,
    body: 'disconnected',
  };
};
