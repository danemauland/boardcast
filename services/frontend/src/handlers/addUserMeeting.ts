import "source-map-support/register";
import { Context, APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import log from '@dazn/lambda-powertools-logger';
import { addUserMeeting } from "@svc/lib/server/addUserMeeting";
import { randomUUID } from "crypto";


export const handler = async (event: APIGatewayEvent, _context: Context): Promise<APIGatewayProxyResult> => {
  log.debug('received event', {event})
  try {
    const email = decodeURIComponent(event.pathParameters?.email!)
    const meeting = JSON.parse(event.body!)

    if (!email) throw new Error("missing email");
    if (!meeting) throw new Error("missing meeting");

    const meetingWithUuid = { ...meeting, uuid: randomUUID(), email }

    await addUserMeeting(email, meetingWithUuid)


    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/html",
      },
      body: meetingWithUuid.uuid
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