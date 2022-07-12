import 'source-map-support/register';
import { Context, APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import log from '@dazn/lambda-powertools-logger';
import { getUserMeetings } from '@svc/lib/server/getUserMeetings';
import { getMeeting } from '@svc/lib/server/getMeeting';
import { isMeetingOwner } from '@svc/lib/server/isMeetingOwner';

export const handler = async (event: APIGatewayEvent, _context: Context): Promise<APIGatewayProxyResult> => {
  log.debug('received event', { event });
  log.debug('context', { context: _context });
  
  try {
    const meetingID = event.pathParameters!.meetingID!;
    const email = event.requestContext!.authorizer!.claims.email

    const isOwner = await isMeetingOwner(meetingID, email)

    if (!isOwner) return {statusCode: 403, headers: {'Content-Type': 'text/html'}, body: 'Unauthorized'}
    
    const meeting = await getMeeting(meetingID, email, true)

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/html",
      },
      body: JSON.stringify(meeting),
    };
  } catch (error) {
    log.error('error', error as Error)
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "text/html",
      },
      body: JSON.stringify(error as Error)
    };
  }
};