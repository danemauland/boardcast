import 'source-map-support/register';
import { Context, APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import render from '../lib/server/render';
import log from '@dazn/lambda-powertools-logger';
import getConfig from '@svc/lib/getConfig';

export const handler = async (event: APIGatewayEvent, _context: Context): Promise<APIGatewayProxyResult> => {
  log.debug('received event', { event });
  try {
    const config = getConfig()
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
      },
      body: await render('/' + config.app.STAGE + event.path),
    };
  } catch (error) {
    log.error('error', error as Error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'text/html',
      },
      body: `<html><body>${(error as Error).toString()}</body></html>`,
    };
  }
};