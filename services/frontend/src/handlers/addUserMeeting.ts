import 'source-map-support/register';
import { Context, APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import log from '@dazn/lambda-powertools-logger';
import { addUserMeeting } from '@svc/lib/server/addUserMeeting';
import { randomUUID } from 'crypto';
import { Meeting } from '@svc/lib/types';


export const handler = async (event: APIGatewayEvent, _context: Context): Promise<APIGatewayProxyResult> => {
  log.debug('received event', { event });
  try {
    const email = decodeURIComponent(event.pathParameters?.email!);
    const meeting = JSON.parse(event.body!);

    if (!email) throw new Error('missing email');
    if (!meeting) throw new Error('missing meeting');

    const meetingID = randomUUID()

    const meetingWithUuid = { ...meeting, meetingID, ownerEmail: email }

    await addUserMeeting(meetingWithUuid);


    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
      },
      body: meetingID,
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