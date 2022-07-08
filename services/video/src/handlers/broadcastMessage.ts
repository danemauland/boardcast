import { DynamoDBStreamEvent } from "aws-lambda";
import log from '@dazn/lambda-powertools-logger';
import { broadcastMessage } from "@svc/lib/broadcastMessage";
import { Message } from "@svc/lib/types";
import { Marshaller } from "@aws/dynamodb-auto-marshaller";

const marshaller = new Marshaller()

export const handler = async (event: DynamoDBStreamEvent) => {
  log.debug('Received event', { event })

  for (let record of event.Records) {
    try {
      const message = marshaller.unmarshallItem(record.dynamodb?.NewImage!) as unknown as Message
      await broadcastMessage(message)
    } catch (e) {
      log.error('error', e as Error)
      return {
        statusCode: 500,
        body: `Connection Failed: ${JSON.stringify(e, Object.getOwnPropertyNames(e))}`
      }
    }

  }

  
  return {
    statusCode: 200,
    body: 'Connection Successful'
  }
}