import 'source-map-support/register';
import { Context, APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import log from '@dazn/lambda-powertools-logger';
import { getUserMeetings } from '@svc/lib/server/getUserMeetings';


export const handler = async (event: APIGatewayEvent, _context: Context): Promise<APIGatewayProxyResult> => {
  log.debug('received event', { event });
  try {
    const email = event.requestContext!.authorizer!.claims.email

    if (!email) throw new Error('missing email');

    const userMeetings = await getUserMeetings(email);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
      },
      body: JSON.stringify(userMeetings),
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