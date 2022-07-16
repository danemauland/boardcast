import 'source-map-support/register';
import { Context, APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import log from '@dazn/lambda-powertools-logger';
import { addUsername } from '@svc/lib/addUsername';


export const handler = async (event: APIGatewayEvent, _context: Context): Promise<APIGatewayProxyResult> => {
  log.debug('received event', { event });
  try {
    const userID = Number(event.pathParameters?.userID);
    const username = JSON.parse(event.body!).username;

    if (!userID) throw new Error('missing userID');
    if (!username) throw new Error('missing username');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
      },
      body: await addUsername(userID, username),
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