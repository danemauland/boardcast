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

export interface Meeting {
  timestamp: string,
  name: string,
  uuid: string,
  ownerEmail: string,
}

export type UserMeeting = Pick<Meeting, 'name' | 'timestamp' | 'uuid' | 'ownerEmail'>

export type DDBUserMeeting = UserMeeting & { type: 'userMeeting', pk: string, sk: string}

export interface DDBMeeting extends Meeting {
  pk: string,
  sk: "details",
  type: "meeting"
}