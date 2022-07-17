import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import log from '@dazn/lambda-powertools-logger';
import { AgendaItem } from '@svc/lib/types';
import { addAgendaItem } from '@svc/lib/addAgendaItem';
import { isMeetingOwner } from '@svc/lib/isMeetingOwner';

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  log.debug('received event', { event });
  try {
    const agendaItem = JSON.parse(event.body!) as AgendaItem;
    const email = event.requestContext!.authorizer!.claims.email;
    const isOwner = await isMeetingOwner(agendaItem.meetingID, email);

    if (!isOwner) return { statusCode: 403, headers: { 'Content-Type': 'text/html' }, body: 'Unauthorized' };

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
