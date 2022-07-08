import "source-map-support/register";
import { Context, APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import render from "../lib/server/render";
import log from '@dazn/lambda-powertools-logger';
import { getUserID } from "@svc/lib/server/getUserID";
import config from "@svc/lib/server/config";


export const handler = async (event: APIGatewayEvent, _context: Context): Promise<APIGatewayProxyResult> => {
  log.debug('received event', {event})
  try {
    const meetingID = event.pathParameters?.meetingID
    const userID = await getUserID()

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/html",
      },
      body: await render(userID, "/" + config.app.STAGE + event.path),
    };
  } catch (error) {
    log.error('error', error as Error)
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "text/html",
      },
      body: `<html><body>${(error as Error).toString()}</body></html>`,
    };
  }
};