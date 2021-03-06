import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import log from '@dazn/lambda-powertools-logger';
import { getMeeting } from '@svc/lib/getMeeting';
import { isMeetingOwner } from '@svc/lib/isMeetingOwner';

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  log.debug('received event', { event });

  try {
    const meetingID = event.pathParameters!.meetingID!;
    const email = event.requestContext!.authorizer!.claims.email;

    const isOwner = await isMeetingOwner(meetingID, email);

    if (!isOwner) return { statusCode: 403, headers: { 'Content-Type': 'text/html' }, body: 'Unauthorized' };

    const meeting = await getMeeting(meetingID, email, true);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
      },
      body: JSON.stringify(meeting),
    };
  } catch (error) {
    log.error('error', error as Error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'text/html',
      },
      body: JSON.stringify(error as Error),
    };
  }
};
