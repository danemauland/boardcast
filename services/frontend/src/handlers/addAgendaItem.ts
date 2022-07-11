import { Context, APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import log from '@dazn/lambda-powertools-logger';
import { addUserMeeting } from '@svc/lib/server/addUserMeeting';
import { randomUUID } from 'crypto';
import { AgendaItem } from '@svc/lib/types';
import { addAgendaItem } from '@svc/lib/server/addAgendaItem';

export const handler = async (event: APIGatewayEvent, _context: Context): Promise<APIGatewayProxyResult> => {
  log.debug('received event', { event });
  try {
    const agendaItem = JSON.parse(event.body!) as AgendaItem

    const savedItem = await addAgendaItem(agendaItem);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
      },
      body: JSON.stringify(savedItem),
    };
  } catch (error) {
    log.error('error', error as Error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'text/html',
      },
      body: (error as Error).toString(),
    };
  }
};