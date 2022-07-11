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

export interface MeetingDetails {
  timestamp: string,
  name: string,
  meetingID: string,
  ownerEmail: string,
  accessTokens: {[key: string]: string}
}

export type UserMeeting = Pick<MeetingDetails, 'name' | 'timestamp' | 'meetingID' | 'ownerEmail'>;

export type DDBUserMeeting = UserMeeting & { type: 'userMeeting', pk: string, sk: string };

export interface DDBMeetingDetails extends MeetingDetails {
  pk: string,
  sk: 'details',
  type: 'meetingDetails'
}

export interface Attachment extends DDBAttachment {
  url?: string,
}

export interface AgendaItem {
  agendaID?: string,
  meetingID: string,
  orderNum: number,
  title: string,
  timeEstimate: number,
  description: number,
  ownerEmail: number,
  attachments: Attachment[],
}

export interface DDBAttachment {
  name: string,
  s3Key: string
}

export interface DDBAgendaItem extends Omit<AgendaItem, 'attachments'> {
  agendaID: string,
  pk: string,
  sk: string,
  type: 'agendaItem'
  attachments: DDBAttachment[]
}

export interface Meeting {
  meetingDetails: MeetingDetails,
  messages: Message[],
  agendaItems: AgendaItem[],
  upload: Upload | null
}

export interface Upload {
  s3Key: string,
  url: string
}