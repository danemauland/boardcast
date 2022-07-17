import 'source-map-support/register';
import { Context, APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import log from '@dazn/lambda-powertools-logger';
import { getMeeting } from '@svc/lib/getMeeting';

export const handler = async (event: APIGatewayEvent, _context: Context): Promise<APIGatewayProxyResult> => {
  log.debug('received event', { event });
  log.debug('context', { context: _context });
  try {
    const meetingID = event.pathParameters!.meetingID!;
    const accessToken = event.pathParameters!.accessToken!;
    const meeting = await getMeeting(meetingID, accessToken)

    if (!meeting.meetingDetails.accessTokens[accessToken]) {
      return {
        statusCode: 403,
        headers: {
        "Content-Type": "text/html",
      },
        body: 'Invalid access token'
      }
    }

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
      body: (error as Error).toString()
    };
  }
};