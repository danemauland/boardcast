import React from 'react';
import UserMeetingComponent from './UserMeetingComponent';
import { UserMeeting } from '../types';

export default function ({ meetings }: { meetings: UserMeeting[] }) {

  return <div style={{ height: 500, width: 200, overflowY: 'scroll' }}>
    {meetings.map((meeting, i) => <UserMeetingComponent meetingID={meeting.meetingID} timestamp={meeting.timestamp} name={meeting.name} key={i} />)}
  </div>;
}