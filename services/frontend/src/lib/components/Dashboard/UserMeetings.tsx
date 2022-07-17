import React from 'react';
import UserMeetingComponent from './UserMeetingComponent';
import { UserMeeting } from '../../types';

export default function UserMeetings({ meetings }: { meetings: UserMeeting[] }) {
  return (
    <div id="meetings">
      <h2>Your boardcasts</h2>
      {meetings.map((meeting) => (
        <UserMeetingComponent
          meetingID={meeting.meetingID}
          timestamp={meeting.timestamp}
          name={meeting.name}
          key={meeting.meetingID}
        />
      ))}
    </div>
  );
}
