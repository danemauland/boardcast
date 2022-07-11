import 'source-map-support/register';
import { Context, APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import log from '@dazn/lambda-powertools-logger';
import { getUserMeetings } from '@svc/lib/server/getUserMeetings';
import { getMeeting } from '@svc/lib/server/getMeeting';

export const handler = async (event: APIGatewayEvent, _context: Context): Promise<APIGatewayProxyResult> => {
  log.debug('received event', { event });
  log.debug('context', { context: _context });
  // TODO make sure user email matches owner email
  try {
    const meetingID = event.pathParameters!.meetingID!;
    const meeting = await getMeeting(meetingID, true)

    console.log({ meeting })

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