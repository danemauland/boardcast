export interface Message {
  wsConnectionID: string,
  email: string,
  meetingID: string,
  text: string,
  timestamp: string,
}

export interface DDBMessage extends Message {
  pk: string,
  sk: string,
  type: 'message'
}