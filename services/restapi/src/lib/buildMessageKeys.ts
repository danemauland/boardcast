import { Message } from './types';

export const buildMessagePK = (message: Pick<Message, 'meetingID'>) => `meeting#${message.meetingID}`;

export const buildMessageSK = ({ timestamp }: { timestamp: string }) => `message#${timestamp}`;

export const buildMessageKeys = (message: Message) => ({
  pk: buildMessagePK(message),
  sk: buildMessageSK(message),
});
