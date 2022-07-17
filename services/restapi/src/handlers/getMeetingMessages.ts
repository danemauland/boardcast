import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import log from '@dazn/lambda-powertools-logger';
import { getMeetingMessages } from '@svc/lib/getMeetingMessages';

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  // todo: add check to make sure requester is owner or invited attendee
  log.debug('received event', { event });
  try {
    const meetingID = event.pathParameters?.meetingID;

    if (!meetingID) throw new Error('missing meetingID');

    const meetingMessages = await getMeetingMessages(meetingID);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
      },
      body: JSON.stringify(meetingMessages),
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
