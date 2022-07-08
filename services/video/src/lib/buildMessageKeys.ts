import { Message } from "./types"

export const buildMessagePK = (message: Message) => `meeting#${message.meetingID}`

export const buildMessageSK = ({ timestamp }: { timestamp: string }) => `message#${timestamp}`

export const buildMessageKeys = (message: Message) => {
  return {
    pk: buildMessagePK(message),
    sk: buildMessageSK(message)
  }
}