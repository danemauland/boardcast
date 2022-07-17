import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import log from '@dazn/lambda-powertools-logger';
import { addUserMeeting } from '@svc/lib/addUserMeeting';
import { randomUUID } from 'crypto';

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  log.debug('received event', { event });
  try {
    const meeting = JSON.parse(event.body!);
    const ownerEmail = event.requestContext?.authorizer?.claims?.email;

    if (!ownerEmail) throw new Error('missing owner email');
    if (!meeting) throw new Error('missing meeting');

    const meetingID = randomUUID();
    const meetingWithUuid = { ...meeting, meetingID, ownerEmail };

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
