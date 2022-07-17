import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import log from '@dazn/lambda-powertools-logger';
import { deleteAgendaItem } from '@svc/lib/deleteAgendaItem';
import { isMeetingOwner } from '@svc/lib/isMeetingOwner';

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  log.debug('received event', { event });
  try {
    const meetingID = event.pathParameters?.meetingID;
    const agendaItemID = event.pathParameters?.agendaItemID;

    if (!meetingID) throw new Error('missing meeting ID');
    if (!agendaItemID) throw new Error('missing agenda item ID');

    const isOwner = await isMeetingOwner(meetingID, event.requestContext!.authorizer!.claims.email);

    if (!isOwner) return { statusCode: 403, headers: { 'Content-Type': 'text/html' }, body: 'Unauthorized' };

    await deleteAgendaItem(meetingID, agendaItemID);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
      },
      body: 'success',
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
