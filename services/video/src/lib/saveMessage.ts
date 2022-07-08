import log from '@dazn/lambda-powertools-logger';
import { PutCommand, PutCommandInput, PutCommandOutput } from "@aws-sdk/lib-dynamodb"
import { ddb, TableName } from "./config"
import { DDBMessage, Message } from "./types"
import { buildMessageKeys } from './buildMessageKeys';

export const saveMessage = async (message: Message, tries = 0): Promise<PutCommandOutput> => {
  const ddbMessage: DDBMessage = {
    ...message,
    ...buildMessageKeys(message),
    type: 'message'
  }

  validateMessage(ddbMessage)

  const putParams: PutCommandInput = {
    TableName,
    Item: ddbMessage,
    ConditionExpression: 'attribute_not_exists(pk)'
  }

  try {
    return await ddb.send(new PutCommand(putParams))
  } catch (e) {
    log.error('saveMessage', e as Error)

    if (tries >= 3) throw new Error("exceeded maximum number of retries");
    if ((e as Error).name === "ConditionalCheckFailedException") return saveMessage({...message, timestamp: new Date().toISOString()}, tries + 1)
  }

  return ddb.send(new PutCommand(putParams))
}

const validateMessage = (message: DDBMessage) => {
  if (
    !message.text ||
    !message.meetingID ||
    !message.wsConnectionID ||
    !message.timestamp ||
    !message.email ||
    !message.pk.includes(message.meetingID) ||
    !message.sk.includes(message.timestamp) ||
    message.type !== 'message'
  ) {
    throw new Error("invalid message");
  }
}