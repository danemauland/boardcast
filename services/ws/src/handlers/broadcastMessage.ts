import { DynamoDBStreamEvent } from 'aws-lambda';
import log from '@dazn/lambda-powertools-logger';
import { broadcastMessage } from '@svc/lib/broadcastMessage';
import { Message } from '@svc/lib/types';
import { Marshaller } from '@aws/dynamodb-auto-marshaller';

const marshaller = new Marshaller();

export const handler = async (event: DynamoDBStreamEvent) => {
  log.debug('Received event', { event });

  const promises = event.Records.map(async (record) => {
    const message = marshaller.unmarshallItem(record.dynamodb?.NewImage!) as unknown as Message;
    return broadcastMessage(message);
  });

  return Promise.all(promises);
};
